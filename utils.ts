
import { Activity, CoinWallet, Medal, UserData, Totals, RankConfig, MonthlyStats, LeagueClass, DisciplineStats, HeatmapDay, MedalRarity, EnduranceSeries, PremiumAchievement } from './types';

// --- Constants ---
const COIN_VALUES: Record<string, number> = {
  '💲': 200,
  '💰': 1000,
  '🧈': 5000,
  '💎': 10000,
  '👑': 50000,
};

export const MEDAL_RARITY_CONFIG = {
  verdant: { color: 'text-emerald-600 bg-emerald-100 dark:bg-emerald-900/30 dark:text-emerald-300', border: 'border-emerald-200 dark:border-emerald-800', value: 1000 },
  cerulean: { color: 'text-sky-600 bg-sky-100 dark:bg-sky-900/30 dark:text-sky-300', border: 'border-sky-200 dark:border-sky-800', value: 5000 },
  amethyst: { color: 'text-purple-600 bg-purple-100 dark:bg-purple-900/30 dark:text-purple-300', border: 'border-purple-200 dark:border-purple-800', value: 10000 },
  auric: { color: 'text-amber-600 bg-amber-100 dark:bg-amber-900/30 dark:text-amber-300', border: 'border-amber-200 dark:border-amber-800', value: 20000 },
  star: { color: 'text-yellow-600 bg-yellow-100 dark:bg-yellow-900/30 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-800', value: 25000 },
  obsidian: { color: 'text-slate-100 bg-slate-900 dark:bg-slate-100 dark:text-slate-900', border: 'border-slate-700', value: 50000 },
};

const PIZZA_KCAL = 800;
const EARTH_CIRCUMFERENCE_KM = 40075;
const EVEREST_HEIGHT_M = 8849;
const CALORIE_SCALE_FACTOR = 0.85;

// --- Formatters ---

export const formatMoney = (value: number): string => {
  if (value >= 1_000_000) return `$${(value / 1_000_000).toFixed(2)}M`;
  if (value >= 1_000) return `$${(value / 1_000).toFixed(0)}k`;
  return `$${value.toLocaleString()}`;
};

export const formatKm = (meters: number): string => {
  return (meters / 1000).toLocaleString(undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }) + ' km';
};

export const formatDuration = (seconds: number): string => {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  return h > 0 ? `${h}h ${m}m` : `${m}m`; 
};

// --- Core Logic ---

const calculateCalories = (activity: Activity): number => {
  if (activity.calories) return activity.calories;
  if (activity.kilojoules) return activity.kilojoules / 4.184;
  const raw = (activity.moving_time / 3600) * 600;
  return raw * CALORIE_SCALE_FACTOR;
};

const calculateMovingAverage = (data: number[], windowSize: number): (number | null)[] => {
    const result: (number | null)[] = [];
    for (let i = 0; i < data.length; i++) {
        if (i < windowSize - 1) {
            result.push(null);
            continue;
        }
        let sum = 0;
        for (let j = 0; j < windowSize; j++) {
            sum += data[i - j];
        }
        result.push(sum / windowSize);
    }
    return result;
};

const calculateEnduranceSeries = (activities: Activity[], windowSize = 50): EnduranceSeries => {
    const chronoActivities = [...activities].sort((a, b) => new Date(a.start_date).getTime() - new Date(b.start_date).getTime());
    
    return {
        dates: chronoActivities.map(a => new Date(a.start_date).toLocaleDateString()),
        distance: calculateMovingAverage(chronoActivities.map(a => a.distance / 1000), windowSize),
        elevation: calculateMovingAverage(chronoActivities.map(a => a.total_elevation_gain), windowSize),
        time: calculateMovingAverage(chronoActivities.map(a => a.moving_time / 3600), windowSize)
    };
}

const determineLeagueClass = (totals: Totals, disciplines: UserData['disciplineStats'], activities: Activity[]): LeagueClass => {
    const maxRunDist = Math.max(0, ...activities.filter(a => a.type === 'Run').map(a => a.distance / 1000));
    const maxRideDist = Math.max(0, ...activities.filter(a => a.type === 'Ride').map(a => a.distance / 1000));
    const maxElev = Math.max(0, ...activities.map(a => a.total_elevation_gain));

    if (totals.hours > 300) {
        return { name: 'Il Re Ritornato', description: 'Legendary endurance across all fields.', emoji: '👑', reasons: ['300+ Hours'], tier: 'tier1' };
    }
    if (maxElev > 2000) {
        return { name: 'Il Guardiano della Montagna', description: 'Master of high altitudes and steep climbs.', emoji: '🏔️', reasons: ['Single climb > 2000m'], tier: 'tier2' };
    }
    if (maxRideDist > 150) {
        return { name: 'Il Cavaliere del Marchio', description: 'Long distance endurance cyclist.', emoji: '🏇', reasons: ['Ride > 150km'], tier: 'tier2' };
    }
    if (maxRunDist > 30) {
         return { name: 'Il Ramingo del Nord', description: 'Ultra-distance runner and trail expert.', emoji: '🏹', reasons: ['Run > 30km'], tier: 'tier2' };
    }
    if (totals.activities > 100) {
         return { name: 'La Sentinella', description: 'Consistent activity day in and day out.', emoji: '🛡️', reasons: ['100+ Activities'], tier: 'tier3' };
    }
    return { name: 'Il Cittadino della Contea', description: 'Enjoying the journey, one step at a time.', emoji: '🏡', reasons: ['Beginner'], tier: 'tier5' };
};

// Medal Definitions
type MedalDef = {
    id: string;
    name: string;
    emoji: string;
    description: string;
    rarity: MedalRarity;
    category: Medal['category'];
    criteria: (a: Activity) => boolean;
};

const MEDAL_DEFINITIONS: MedalDef[] = [
    { id: 'marathon_finisher', name: 'Marathon Finisher', emoji: '🏃', description: 'Completed a marathon', rarity: 'obsidian', category: 'Volume', criteria: (a) => a.type === 'Run' && a.distance >= 42195 },
    { id: 'ultra_runner', name: 'Ultra Runner', emoji: '🏃‍♂️💨', description: '50km+ Run', rarity: 'obsidian', category: 'Best in Class', criteria: (a) => a.type === 'Run' && a.distance >= 50000 },
    { id: 'ultra_voyager', name: 'Ultra Voyager', emoji: '🧭', description: '200km+ Ride', rarity: 'obsidian', category: 'Best in Class', criteria: (a) => a.type === 'Ride' && a.distance >= 200000 },
    { id: 'century_ride', name: 'Century Ride', emoji: '💯', description: '100km+ Ride', rarity: 'auric', category: 'Volume', criteria: (a) => a.type === 'Ride' && a.distance >= 100000 },
    { id: 'half_marathon', name: 'Half Marathon', emoji: '👟', description: '21km+ Run', rarity: 'cerulean', category: 'Volume', criteria: (a) => a.type === 'Run' && a.distance >= 21097 },
    
    { id: 'peak_fueler', name: 'Peak Fueler', emoji: '🍲', description: 'Burned 4000+ kcal', rarity: 'auric', category: 'Volume', criteria: (a) => (a.calories || 0) >= 4000 },
    { id: 'skyward', name: 'Skyward Cyclist', emoji: '🚵‍♀️', description: '3000m+ Elevation', rarity: 'obsidian', category: 'Volume', criteria: (a) => a.total_elevation_gain >= 3000 },
    { id: 'alpine_sprinter', name: 'Alpine Sprinter', emoji: '🧊', description: '1500m+ gain in <60km ride', rarity: 'amethyst', category: 'Performance', criteria: (a) => a.type === 'Ride' && a.total_elevation_gain >= 1500 && a.distance < 60000 },
    
    { id: 'crowd_pleaser', name: 'Crowd Pleaser', emoji: '👏', description: '50+ Kudos', rarity: 'auric', category: 'Social', criteria: (a) => a.kudos_count >= 50 },
    { id: 'community_star', name: 'Community Star', emoji: '🌟', description: '100+ Kudos', rarity: 'obsidian', category: 'Social', criteria: (a) => a.kudos_count >= 100 },

    { id: 'early_riser', name: 'Early Riser', emoji: '🌅', description: 'Activity before 6 AM', rarity: 'verdant', category: 'Special', criteria: (a) => new Date(a.start_date_local).getHours() < 6 },
    { id: 'night_owl', name: 'Night Owl', emoji: '🦉', description: 'Activity after 9 PM', rarity: 'verdant', category: 'Special', criteria: (a) => new Date(a.start_date_local).getHours() >= 21 },
    
    { id: 'christmas', name: 'Christmas Champion', emoji: '🎄', description: 'Activity on Dec 25', rarity: 'cerulean', category: 'Special', criteria: (a) => { const d = new Date(a.start_date_local); return d.getMonth() === 11 && d.getDate() === 25; } },
    { id: 'new_year', name: 'New Year Hero', emoji: '🎆', description: 'Activity on Jan 1', rarity: 'cerulean', category: 'Special', criteria: (a) => { const d = new Date(a.start_date_local); return d.getMonth() === 0 && d.getDate() === 1; } },
    
    { id: 'urban_ladder', name: 'Urban Ladder', emoji: '🏙️', description: '500m+ gain in <10km run', rarity: 'amethyst', category: 'Performance', criteria: (a) => a.type === 'Run' && a.total_elevation_gain >= 500 && a.distance <= 10000 },
    { id: 'volcanic', name: 'Volcanic Vertical', emoji: '🌋', description: '4000m+ Elevation gain', rarity: 'obsidian', category: 'Best in Class', criteria: (a) => a.total_elevation_gain >= 4000 },
    { id: 'tempo_trailblazer', name: 'Tempo Trailblazer', emoji: '🚀', description: 'Run 15km+ at <4:30/km (approx)', rarity: 'amethyst', category: 'Performance', criteria: (a) => a.type === 'Run' && a.distance >= 15000 && a.average_speed > 3.7 }, 
];

// Premium Achievements Logic (Aggregated over time)
const calculatePremiumAchievements = (activities: Activity[]): PremiumAchievement[] => {
    const achievements: PremiumAchievement[] = [];
    const years = new Set(activities.map(a => new Date(a.start_date).getFullYear()));
    const activityList = activities;

    years.forEach(year => {
        const yearActs = activityList.filter(a => new Date(a.start_date).getFullYear() === year);
        
        // Distance
        const yearDistKm = yearActs.reduce((s, a) => s + a.distance, 0) / 1000;
        if (yearDistKm >= 10000) {
            achievements.push({ id: `10k_year_${year}`, label: `10,000 km Year (${year})`, description: 'Covered 10k km in a year', emoji: '🚀', count: 1 });
        }

        // Elevation
        const yearElev = yearActs.reduce((s, a) => s + a.total_elevation_gain, 0);
        if (yearElev >= 200000) {
            achievements.push({ id: `200k_climb_${year}`, label: `200k Climber (${year})`, description: '200,000m elevation in a year', emoji: '🗻', count: 1 });
        }

        // Hours
        const yearHours = yearActs.reduce((s, a) => s + a.moving_time, 0) / 3600;
        if (yearHours >= 365) {
            achievements.push({ id: `365_hours_${year}`, label: `365 Hour Year (${year})`, description: 'Averaged 1 hour per day', emoji: '⏱️', count: 1 });
        }
    });

    // Lifetime
    if (activities.length >= 1000) {
        achievements.push({ id: '1k_activities', label: '1,000 Activities', description: 'Lifetime club member', emoji: '📈', count: 1 });
    }

    // Consolidate counts for same types if needed, but for now return instances
    // We'll group by label for display count
    const grouped: Record<string, PremiumAchievement> = {};
    achievements.forEach(a => {
        const key = a.label.split(' (')[0]; // Group by "10,000 km Year" ignoring year
        if (!grouped[key]) {
            grouped[key] = { ...a, label: key, count: 0 };
        }
        grouped[key].count++;
    });

    return Object.values(grouped).sort((a, b) => b.count - a.count);
};


export const processUserData = (athlete: any, rawActivities: Activity[]): UserData => {
  const activities = [...rawActivities].sort((a, b) => new Date(b.start_date).getTime() - new Date(a.start_date).getTime());
  const wallet: CoinWallet = { '💲': 0, '💰': 0, '🧈': 0, '💎': 0, '👑': 0 };
  const medalMap = new Map<string, Medal>();
  const totals: Totals = { distance: 0, elevation: 0, hours: 0, calories: 0, activities: 0, likes: 0, pizzas: 0, everests: 0, worldTrips: 0 };
  const monthlyStatsMap = new Map<string, MonthlyStats>();
  const disciplineStats: UserData['disciplineStats'] = {
      run: { count: 0, distanceKm: 0, elevationM: 0, timeSeconds: 0 },
      ride: { count: 0, distanceKm: 0, elevationM: 0, timeSeconds: 0 },
      swim: { count: 0, distanceKm: 0, elevationM: 0, timeSeconds: 0 },
  };

  // Generate Heatmap Structure
  const days: Record<string, HeatmapDay> = {};
  const now = new Date();
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(now.getFullYear() - 1);
  
  for (let d = new Date(oneYearAgo); d <= now; d.setDate(d.getDate() + 1)) {
      const dateStr = d.toISOString().split('T')[0];
      days[dateStr] = { date: dateStr, intensity: 0, value: 0, hasMedal: false, activities: [], coins: [], medals: [] };
  }

  activities.forEach(act => {
    const distKm = act.distance / 1000;
    const elev = act.total_elevation_gain;
    const hours = act.moving_time / 3600;
    const cals = calculateCalories(act);
    const date = new Date(act.start_date);
    const dateStr = act.start_date.split('T')[0];
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
    const type = (act.type || '').toLowerCase();

    // Activity Enrichment Containers
    act.earned_medals = [];
    act.earned_coins = [];
    act.earned_value = 0;

    // Aggregates
    totals.distance += act.distance;
    totals.elevation += elev;
    totals.hours += hours;
    totals.calories += cals;
    totals.activities++;
    totals.likes += act.kudos_count;

    // Discipline
    if (type.includes('run')) {
        disciplineStats.run.count++;
        disciplineStats.run.distanceKm += distKm;
        disciplineStats.run.elevationM += elev;
        disciplineStats.run.timeSeconds += act.moving_time;
    } else if (type.includes('ride')) {
        disciplineStats.ride.count++;
        disciplineStats.ride.distanceKm += distKm;
        disciplineStats.ride.elevationM += elev;
        disciplineStats.ride.timeSeconds += act.moving_time;
    } else if (type.includes('swim')) {
        disciplineStats.swim.count++;
        disciplineStats.swim.distanceKm += distKm;
        disciplineStats.swim.elevationM += elev;
        disciplineStats.swim.timeSeconds += act.moving_time;
    }

    // Coins Logic
    const actCoins: string[] = [];
    if (type.includes('run')) {
      if (distKm >= 65) actCoins.push('👑');
      else if (distKm >= 42.2) actCoins.push('💎');
      else if (distKm >= 21.1) actCoins.push('🧈');
      else if (distKm >= 15) actCoins.push('💰');
      else if (distKm >= 10) actCoins.push('💲');
    } else if (type.includes('ride')) {
      if (distKm >= 200) actCoins.push('👑');
      else if (distKm >= 150) actCoins.push('💎');
      else if (distKm >= 100) actCoins.push('🧈');
      else if (distKm >= 80) actCoins.push('💰');
      else if (distKm >= 50) actCoins.push('💲');
    }
    if (elev >= 3000) actCoins.push('👑');
    else if (elev >= 2000) actCoins.push('💎');
    else if (elev >= 1000) actCoins.push('🧈');
    if (cals >= 4000) actCoins.push('💎');
    else if (cals >= 2000) actCoins.push('💰');

    let actCoinValue = 0;
    actCoins.forEach(c => {
      if (wallet[c as keyof CoinWallet] !== undefined) {
        wallet[c as keyof CoinWallet]++;
        actCoinValue += COIN_VALUES[c];
      }
    });
    act.earned_coins = actCoins;
    act.earned_value += actCoinValue;

    // Medals Logic
    MEDAL_DEFINITIONS.forEach(def => {
        if (def.criteria(act)) {
            if (!medalMap.has(def.id)) {
                medalMap.set(def.id, { 
                    id: def.id, name: def.name, emoji: def.emoji, description: def.description, 
                    rarity: def.rarity, category: def.category, count: 0, value: MEDAL_RARITY_CONFIG[def.rarity].value 
                });
            }
            const medal = medalMap.get(def.id)!;
            medal.count++;
            act.earned_medals!.push(medal);
            act.earned_value! += medal.value;
        }
    });

    // Monthly Stats - now enriched
    if (!monthlyStatsMap.has(monthKey)) {
        monthlyStatsMap.set(monthKey, { 
            monthKey: monthKey,
            label: date.toLocaleDateString(undefined, { month: 'long', year: 'numeric' }),
            distance: 0, 
            elevation: 0, 
            hours: 0, 
            coinsValue: 0,
            medalsValue: 0,
            totalValue: 0,
            activityCount: 0,
            activities: [],
            coinsBreakdown: { '💲': 0, '💰': 0, '🧈': 0, '💎': 0, '👑': 0 },
            medalsEarned: []
        });
    }
    const mStat = monthlyStatsMap.get(monthKey)!;
    mStat.distance += act.distance;
    mStat.elevation += elev;
    mStat.hours += hours;
    mStat.coinsValue += act.earned_value; // Includes medals value now in act.earned_value? No, split logic
    // Re-calculating separation
    const activityCoinVal = act.earned_coins?.reduce((s, c) => s + COIN_VALUES[c], 0) || 0;
    const activityMedalVal = act.earned_medals?.reduce((s, m) => s + m.value, 0) || 0;
    
    // Correction: mStat.coinsValue was accumulating Total. Let's fix
    // Actually let's reset logic for clarity
    // mStat.coinsValue (purely coins)
    mStat.coinsValue -= (act.earned_value - activityCoinVal); // Remove medal portion if previously added (it wasn't, logic above added total)
    // Actually act.earned_value includes medals. Let's be precise.
    mStat.coinsValue = (mStat.coinsValue - act.earned_value) + activityCoinVal; 
    mStat.medalsValue += activityMedalVal;
    mStat.totalValue += act.earned_value;
    mStat.activityCount++;
    mStat.activities.push(act);
    
    act.earned_coins?.forEach(c => {
        if (mStat.coinsBreakdown[c as keyof CoinWallet] !== undefined) {
            mStat.coinsBreakdown[c as keyof CoinWallet]++;
        }
    });
    act.earned_medals?.forEach(m => {
        // Clone medal to avoid reference issues if count aggregated globally
        const mClone = { ...m, count: 1 };
        const existing = mStat.medalsEarned.find(ex => ex.id === m.id);
        if (existing) existing.count++;
        else mStat.medalsEarned.push(mClone);
    });

    // Heatmap Day update
    if (days[dateStr]) {
        const d = days[dateStr];
        d.activities.push(act);
        d.value += act.earned_value;
        d.coins.push(...actCoins);
        if (act.earned_medals && act.earned_medals.length > 0) {
            d.hasMedal = true;
            d.medals.push(...act.earned_medals);
        }

        // Recalculate intensity based on value
        // Simple heuristic: >0=1, >200=2, >1000=3, >5000=4
        if (d.value > 5000) d.intensity = 4;
        else if (d.value > 1000) d.intensity = 3;
        else if (d.value > 200) d.intensity = 2;
        else if (d.value > 0) d.intensity = 1;
    }
  });

  // 4. Derived Stats
  totals.pizzas = totals.calories / PIZZA_KCAL;
  totals.everests = totals.elevation / EVEREST_HEIGHT_M;
  totals.worldTrips = (totals.distance / 1000) / EARTH_CIRCUMFERENCE_KM;

  if (disciplineStats.run.count > 0) {
      disciplineStats.run.avgDist = disciplineStats.run.distanceKm / disciplineStats.run.count;
      const totalRunMin = disciplineStats.run.timeSeconds / 60;
      disciplineStats.run.avgSpeed = totalRunMin / disciplineStats.run.distanceKm; 
  }
  if (disciplineStats.ride.count > 0) {
      disciplineStats.ride.avgDist = disciplineStats.ride.distanceKm / disciplineStats.ride.count;
      const totalRideHr = disciplineStats.ride.timeSeconds / 3600;
      disciplineStats.ride.avgSpeed = disciplineStats.ride.distanceKm / totalRideHr;
  }
  if (disciplineStats.swim.count > 0) {
      disciplineStats.swim.avgDist = disciplineStats.swim.distanceKm / disciplineStats.swim.count;
  }

  const allSeries = calculateEnduranceSeries(activities);
  const runSeries = calculateEnduranceSeries(activities.filter(a => a.type.toLowerCase().includes('run')));
  const rideSeries = calculateEnduranceSeries(activities.filter(a => a.type.toLowerCase().includes('ride')));

  // 5. Rank
  const ALL_RANKS = (() => {
      const ranks: RankConfig[] = [];
      let h = 0;
      [{n:'Wood',l:10,e:'🪵'},{n:'Metal',l:10,e:'⚙️'},{n:'Bronze',l:10,e:'🥉'},{n:'Silver',l:10,e:'🥈'},{n:'Gold',l:10,e:'🥇'},{n:'Platinum',l:10,e:'💎'}]
      .forEach(g => { for(let i=1;i<=g.l;i++) { ranks.push({name:`${g.n} ${i}`,emoji:g.e,minHours:h,tier:g.n}); h+=100; } });
      return ranks;
  })();

  let rank = ALL_RANKS[0];
  let rankIndex = 0;
  for (let i = 0; i < ALL_RANKS.length; i++) {
    if (totals.hours >= ALL_RANKS[i].minHours) {
        rank = ALL_RANKS[i];
        rankIndex = i;
    } else break;
  }
  const nextRank = ALL_RANKS[rankIndex + 1];
  let nextRankProgress = 100;
  if (nextRank) {
      const range = nextRank.minHours - rank.minHours;
      const currentInRank = totals.hours - rank.minHours;
      nextRankProgress = Math.min(100, Math.max(0, (currentInRank / range) * 100));
  }

  // 6. Final Wallet
  let walletValue = 0;
  Object.entries(wallet).forEach(([key, count]) => walletValue += (COIN_VALUES[key] * count));
  const finalMedalValue = Array.from(medalMap.values()).reduce((sum, m) => sum + (m.count * m.value), 0);
  walletValue += finalMedalValue;

  const premiumAchievements = calculatePremiumAchievements(activities);

  return {
    athlete,
    activities,
    wallet,
    medals: Array.from(medalMap.values()).sort((a, b) => b.value - a.value || b.count - a.count),
    premiumAchievements,
    totals,
    level: rankIndex + 1,
    rank,
    nextRank,
    nextRankProgress,
    walletValue,
    monthlyStats: Array.from(monthlyStatsMap.values()).sort((a, b) => b.monthKey.localeCompare(a.monthKey)), // Newest first
    leagueClass: determineLeagueClass(totals, disciplineStats, activities),
    disciplineStats,
    heatmap: Object.values(days).sort((a, b) => a.date.localeCompare(b.date)),
    enduranceStats: { all: allSeries, run: runSeries, ride: rideSeries }
  };
};
