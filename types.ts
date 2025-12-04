
export interface Athlete {
  id: number;
  username?: string;
  firstname?: string;
  lastname?: string;
  profile?: string;
  bio?: string;
  city?: string;
  country?: string;
}

export interface Activity {
  id: number;
  name: string;
  distance: number; // meters
  moving_time: number; // seconds
  elapsed_time: number; // seconds
  total_elevation_gain: number; // meters
  type: string;
  sport_type: string;
  start_date: string;
  start_date_local: string;
  average_speed: number;
  max_speed: number;
  kudos_count: number;
  calories?: number;
  kilojoules?: number;
  suffer_score?: number;
  average_heartrate?: number;
  max_heartrate?: number;
  average_cadence?: number;
  average_watts?: number;
  weighted_average_watts?: number;
  device_watts?: boolean;
  location_country?: string;
  // Enriched data
  earned_medals?: Medal[];
  earned_coins?: string[];
  earned_value?: number;
}

export interface CoinWallet {
  '💲': number; // Standard (200)
  '💰': number; // Bag (1000)
  '🧈': number; // Gold Bar (5000)
  '💎': number; // Diamond (10000)
  '👑': number; // Crown (50000)
}

export type CoinType = keyof CoinWallet;

export type MedalRarity = 'verdant' | 'cerulean' | 'amethyst' | 'auric' | 'star' | 'obsidian';

export interface Medal {
  id: string;
  name: string;
  emoji: string;
  description: string;
  rarity: MedalRarity;
  count: number;
  value: number; // Dollar value
  category?: 'Consistency' | 'Performance' | 'Volume' | 'Social' | 'Special' | 'Best in Class' | 'Milestones';
  progress?: number; // 0-100 for unearned
}

export interface PremiumAchievement {
    id: string;
    label: string;
    description: string;
    emoji: string;
    count: number;
}

export interface RankConfig {
  name: string;
  emoji: string;
  minHours: number;
  tier: string;
}

export interface Totals {
  distance: number;
  elevation: number;
  hours: number;
  calories: number;
  activities: number;
  likes: number;
  pizzas: number;
  everests: number;
  worldTrips: number;
}

export interface MonthlyStats {
  monthKey: string; // YYYY-MM
  label: string; // e.g. "May 2024"
  distance: number;
  elevation: number;
  hours: number;
  coinsValue: number;
  medalsValue: number;
  totalValue: number;
  activityCount: number;
  // Detailed lists for popups
  activities: Activity[];
  coinsBreakdown: CoinWallet;
  medalsEarned: Medal[];
}

export interface LeagueClass {
    name: string;
    description: string;
    emoji: string;
    reasons: string[];
    tier: 'tier1' | 'tier2' | 'tier3' | 'tier4' | 'tier5';
}

export interface DisciplineStats {
    count: number;
    distanceKm: number;
    elevationM: number;
    timeSeconds: number;
    avgSpeed?: number; // km/h or min/km
    avgDist?: number;
    avgClimb?: number;
}

export interface HeatmapDay {
    date: string; // YYYY-MM-DD
    intensity: 0 | 1 | 2 | 3 | 4; // 0 is empty, 4 is max
    value: number; // Normalized score (e.g. wallet value earned that day)
    hasMedal: boolean;
    activities: Activity[];
    coins: string[];
    medals: Medal[];
}

export interface EnduranceSeries {
    dates: string[];
    distance: (number | null)[];
    elevation: (number | null)[];
    time: (number | null)[];
}

export interface UserData {
  athlete: Athlete;
  activities: Activity[];
  wallet: CoinWallet;
  medals: Medal[];
  premiumAchievements: PremiumAchievement[];
  totals: Totals;
  level: number;
  rank: RankConfig;
  nextRank?: RankConfig;
  nextRankProgress: number; // 0-100
  walletValue: number;
  monthlyStats: MonthlyStats[];
  leagueClass: LeagueClass;
  disciplineStats: {
      run: DisciplineStats;
      ride: DisciplineStats;
      swim: DisciplineStats;
  };
  heatmap: HeatmapDay[];
  enduranceStats: {
      all: EnduranceSeries;
      run: EnduranceSeries;
      ride: EnduranceSeries;
  };
}

export interface LeaderboardEntry {
  userId: string;
  displayName: string;
  rank: RankConfig;
  level: number;
  walletValue: number;
  coins: number;
  medals: number;
  lastActive: string;
  rankEmoji?: string;
}
