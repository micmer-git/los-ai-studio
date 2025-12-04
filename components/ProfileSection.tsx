
import React, { useState } from 'react';
import { UserData, MonthlyStats, CoinWallet, Medal, DisciplineStats } from '../types';
import { Card, Badge, Modal } from './ui';
import { formatMoney, formatDuration, formatKm } from '../utils';

interface Props {
  data: UserData;
}

export const ProfileSection: React.FC<Props> = ({ data }) => {
  const [isRankModalOpen, setIsRankModalOpen] = useState(false);
  const [isWalletModalOpen, setIsWalletModalOpen] = useState(false);
  const [selectedMonth, setSelectedMonth] = useState<MonthlyStats | null>(null);

  // Calculate total medals from wallet (if stored separately) or data.medals
  const totalMedalCount = data.medals.reduce((a, b) => a + b.count, 0);
  
  const coinBreakdown = Object.entries(data.wallet) as [keyof CoinWallet, number][];

  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Profile Card */}
        <Card className="col-span-1 lg:col-span-2">
        <div className="flex flex-col sm:flex-row gap-6">
            <div className="flex-shrink-0 flex justify-center sm:justify-start">
            <div className="relative cursor-pointer group" onClick={() => setIsRankModalOpen(true)}>
                <div className="w-24 h-24 rounded-full p-1 bg-gradient-to-br from-orange-400 to-red-600 shadow-xl group-hover:scale-105 transition-transform">
                    <img 
                        src={data.athlete.profile || "https://picsum.photos/200"} 
                        alt="Profile" 
                        className="w-full h-full rounded-full border-4 border-white dark:border-slate-800 object-cover bg-slate-200"
                    />
                </div>
                <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-slate-900 text-white text-xs font-bold px-3 py-1 rounded-full border-2 border-white dark:border-slate-700 shadow-lg whitespace-nowrap flex items-center gap-1">
                    <span>{data.rank.emoji}</span> Lvl {data.level}
                </div>
            </div>
            </div>
            
            <div className="flex-1 w-full space-y-5">
            <div className="flex flex-col sm:flex-row justify-between items-center sm:items-start text-center sm:text-left gap-4">
                <div>
                <h1 className="text-3xl font-black text-slate-900 dark:text-white tracking-tight">
                    {data.athlete.firstname} {data.athlete.lastname}
                </h1>
                <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2 mt-1">
                    <Badge color="blue">{data.rank.name}</Badge>
                    <Badge color="purple">{data.leagueClass.name} {data.leagueClass.emoji}</Badge>
                </div>
                </div>
                <div 
                    className="bg-emerald-50 dark:bg-emerald-900/20 px-5 py-3 rounded-2xl border border-emerald-100 dark:border-emerald-900/50 shadow-sm cursor-pointer hover:bg-emerald-100 dark:hover:bg-emerald-900/30 transition-colors"
                    onClick={() => setIsWalletModalOpen(true)}
                >
                    <div className="text-[10px] text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-widest mb-0.5">Net Worth</div>
                    <div className="text-3xl font-black text-emerald-700 dark:text-emerald-300 tracking-tight leading-none">{formatMoney(data.walletValue)}</div>
                </div>
            </div>

            <div className="space-y-1.5 cursor-pointer" onClick={() => setIsRankModalOpen(true)}>
                <div className="flex justify-between text-xs font-bold text-slate-600 dark:text-slate-400">
                    <span>{formatDuration(data.totals.hours * 3600)} total hours</span>
                    <span className="text-strava">{data.nextRank ? `${Math.round(data.nextRankProgress)}% to ${data.nextRank.name}` : 'Max Rank'}</span>
                </div>
                <div className="h-3 w-full bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden shadow-inner">
                    <div 
                        className="h-full bg-gradient-to-r from-orange-500 to-red-500 rounded-full relative overflow-hidden"
                        style={{ width: `${data.nextRankProgress}%` }}
                    >
                        <div className="absolute inset-0 bg-white/20 animate-[shimmer_2s_infinite]"></div>
                    </div>
                </div>
            </div>

            <div className="grid grid-cols-4 gap-2 sm:gap-4 pt-2">
                <StatPill icon="🌍" value={data.totals.worldTrips.toFixed(2)} label="World Trips" />
                <StatPill icon="🏔️" value={data.totals.everests.toFixed(1)} label="Everests" />
                <StatPill icon="🍕" value={data.totals.pizzas.toFixed(0)} label="Pizzas" />
                <StatPill icon="👍" value={data.totals.likes.toLocaleString()} label="Kudos" />
            </div>
            </div>
        </div>

        {data.premiumAchievements.length > 0 && (
             <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700/50">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-4">Top Achievements</h4>
                <div className="flex gap-4 overflow-x-auto no-scrollbar pb-2">
                    {data.premiumAchievements.map((ach) => (
                        <div key={ach.id} className="flex-shrink-0 bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-4 rounded-xl shadow-sm min-w-[200px]">
                             <div className="flex items-center gap-2 mb-1">
                                <span className="text-2xl">{ach.emoji}</span>
                                <span className="text-xs font-bold text-slate-900 dark:text-white">{ach.count}x</span>
                             </div>
                             <div className="text-sm font-bold text-slate-700 dark:text-slate-200">{ach.label}</div>
                             <div className="text-[10px] text-slate-500 dark:text-slate-400">{ach.description}</div>
                        </div>
                    ))}
                </div>
             </div>
        )}

        {/* Rank Modal */}
        <Modal isOpen={isRankModalOpen} onClose={() => setIsRankModalOpen(false)} title="Rank Progression">
            <div className="space-y-6">
                <div className="flex items-center gap-4 bg-slate-50 dark:bg-slate-800/50 p-4 rounded-xl">
                    <div className="text-4xl">{data.rank.emoji}</div>
                    <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-lg">{data.rank.name}</h4>
                        <p className="text-sm text-slate-500 dark:text-slate-400">Current Tier: {data.rank.tier}</p>
                    </div>
                </div>
                
                <div className="space-y-2">
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white">Next Milestone</h5>
                    {data.nextRank ? (
                        <div className="border border-slate-200 dark:border-slate-700 rounded-xl p-4">
                            <div className="flex justify-between items-center mb-2">
                                <span className="font-medium text-slate-700 dark:text-slate-200 flex items-center gap-2">
                                    <span>{data.nextRank.emoji}</span> {data.nextRank.name}
                                </span>
                                <span className="text-xs font-bold text-slate-500">{data.nextRank.minHours}h required</span>
                            </div>
                            <div className="h-2 bg-slate-100 dark:bg-slate-700 rounded-full overflow-hidden">
                                <div className="h-full bg-strava rounded-full" style={{ width: `${data.nextRankProgress}%` }}></div>
                            </div>
                            <div className="mt-2 text-xs text-slate-500 text-right">
                                {Math.max(0, Math.round(data.nextRank.minHours - data.totals.hours))} hours to go
                            </div>
                        </div>
                    ) : (
                        <p className="text-sm text-emerald-500">You have reached the pinnacle of the league!</p>
                    )}
                </div>

                <div>
                    <h5 className="font-bold text-sm text-slate-900 dark:text-white mb-3">League Class: {data.leagueClass.name}</h5>
                    <p className="text-sm text-slate-600 dark:text-slate-300 mb-3 italic">"{data.leagueClass.description}"</p>
                    <ul className="space-y-2">
                        {data.leagueClass.reasons.map((reason, i) => (
                            <li key={i} className="text-xs flex items-center gap-2 text-slate-500 dark:text-slate-400">
                                <span className="w-1.5 h-1.5 rounded-full bg-strava"></span> {reason}
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </Modal>

        {/* Wallet Breakdown Modal */}
        <Modal isOpen={isWalletModalOpen} onClose={() => setIsWalletModalOpen(false)} title="Wallet Breakdown">
             <div className="space-y-6">
                 <div className="text-center py-4 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-100 dark:border-emerald-800">
                     <div className="text-sm text-emerald-600 dark:text-emerald-400 font-bold uppercase tracking-wider">Total Net Worth</div>
                     <div className="text-4xl font-black text-emerald-700 dark:text-emerald-300">{formatMoney(data.walletValue)}</div>
                 </div>

                 <div className="grid grid-cols-2 gap-4">
                     <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                         <div className="text-xs text-slate-500 font-bold uppercase mb-1">Coin Value</div>
                         <div className="text-xl font-bold text-slate-800 dark:text-white">
                             {formatMoney(data.walletValue - data.medals.reduce((s, m) => s + (m.count * m.value), 0))}
                         </div>
                         <div className="text-[10px] text-slate-400 mt-1">From activity coins</div>
                     </div>
                     <div className="p-4 bg-slate-50 dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700">
                         <div className="text-xs text-slate-500 font-bold uppercase mb-1">Medal Value</div>
                         <div className="text-xl font-bold text-slate-800 dark:text-white">
                             {formatMoney(data.medals.reduce((s, m) => s + (m.count * m.value), 0))}
                         </div>
                         <div className="text-[10px] text-slate-400 mt-1">From {totalMedalCount} medals</div>
                     </div>
                 </div>

                 <div>
                     <h4 className="text-sm font-bold text-slate-900 dark:text-white mb-3">Coin Inventory</h4>
                     <div className="space-y-2">
                         {coinBreakdown.map(([emoji, count]) => (
                             <div key={emoji} className="flex items-center justify-between p-3 bg-white dark:bg-slate-700/50 rounded-lg border border-slate-100 dark:border-slate-700">
                                 <div className="flex items-center gap-3">
                                     <span className="text-2xl">{emoji}</span>
                                     <span className="text-sm font-medium text-slate-700 dark:text-slate-200">
                                         {emoji === '💲' ? 'Standard' : emoji === '💰' ? 'Bag' : emoji === '🧈' ? 'Gold Bar' : emoji === '💎' ? 'Diamond' : 'Crown'}
                                     </span>
                                 </div>
                                 <div className="font-mono font-bold text-slate-900 dark:text-white">x{count}</div>
                             </div>
                         ))}
                     </div>
                 </div>
             </div>
        </Modal>

        </Card>

        <div className="col-span-1 space-y-6">
            <Card title="Discipline Mix" className="h-full" noPadding>
                <div className="divide-y divide-slate-100 dark:divide-slate-700/50">
                    <DisciplineRow 
                        type="Run" 
                        emoji="🏃" 
                        stats={data.disciplineStats.run} 
                        label="Pace" 
                        val={data.disciplineStats.run.avgSpeed ? `${(1/data.disciplineStats.run.avgSpeed).toFixed(2).replace('.', ':')}/km` : '-'} 
                    />
                    <DisciplineRow 
                        type="Ride" 
                        emoji="🚴" 
                        stats={data.disciplineStats.ride} 
                        label="Speed" 
                        val={data.disciplineStats.ride.avgSpeed ? `${data.disciplineStats.ride.avgSpeed.toFixed(1)} km/h` : '-'} 
                    />
                    <DisciplineRow 
                        type="Swim" 
                        emoji="🏊" 
                        stats={data.disciplineStats.swim} 
                        label="Dist" 
                        val={data.disciplineStats.swim.avgDist ? `${(data.disciplineStats.swim.avgDist*1000).toFixed(0)}m` : '-'} 
                    />
                </div>
            </Card>

            <Card title="Monthly Wallet Heatmap" noPadding>
                <div className="p-4">
                    <MonthlyHeatmap data={data.monthlyStats} onMonthClick={setSelectedMonth} />
                </div>
                <div className="px-4 pb-4 text-center text-[10px] text-slate-400">
                    Click a month to view details
                </div>
            </Card>
        </div>

        {/* Month Detail Modal */}
        <Modal isOpen={!!selectedMonth} onClose={() => setSelectedMonth(null)} title={selectedMonth?.label || ''}>
            {selectedMonth && (
                <div className="space-y-6">
                    <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-xl border border-emerald-100 dark:border-emerald-800 flex justify-between items-center">
                         <div>
                             <div className="text-xs font-bold text-emerald-600 dark:text-emerald-400 uppercase">Total Value</div>
                             <div className="text-2xl font-black text-emerald-700 dark:text-emerald-300">{formatMoney(selectedMonth.totalValue)}</div>
                         </div>
                         <div className="text-right text-xs text-emerald-600/70 dark:text-emerald-400/70">
                             <div>Coins: {formatMoney(selectedMonth.coinsValue)}</div>
                             <div>Medals: {formatMoney(selectedMonth.medalsValue)}</div>
                         </div>
                    </div>

                    <div>
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider mb-3">Month Summary</h4>
                        <div className="grid grid-cols-3 gap-2 text-center">
                             <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                 <div className="text-lg font-bold">{selectedMonth.activityCount}</div>
                                 <div className="text-[10px] text-slate-400 uppercase">Activities</div>
                             </div>
                             <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                 <div className="text-lg font-bold">{formatKm(selectedMonth.distance)}</div>
                                 <div className="text-[10px] text-slate-400 uppercase">Dist</div>
                             </div>
                             <div className="p-2 bg-slate-50 dark:bg-slate-800 rounded-lg">
                                 <div className="text-lg font-bold">{Math.round(selectedMonth.elevation)}m</div>
                                 <div className="text-[10px] text-slate-400 uppercase">Elev</div>
                             </div>
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Coins Minted</h4>
                        <div className="flex flex-wrap gap-2">
                            {(Object.entries(selectedMonth.coinsBreakdown) as [keyof CoinWallet, number][]).map(([emoji, count]) => (
                                count > 0 && (
                                    <span key={emoji} className="inline-flex items-center px-2.5 py-1 rounded-full bg-white dark:bg-slate-700 border border-slate-200 dark:border-slate-600 text-xs font-bold shadow-sm">
                                        {emoji} x{count}
                                    </span>
                                )
                            ))}
                            {Object.values(selectedMonth.coinsBreakdown).every(c => c === 0) && (
                                <span className="text-sm text-slate-400 italic">No coins minted this month.</span>
                            )}
                        </div>
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Medals Unlocked</h4>
                        {selectedMonth.medalsEarned.length > 0 ? (
                             <div className="grid grid-cols-2 gap-2">
                                 {selectedMonth.medalsEarned.map((medal, idx) => (
                                     <div key={`${medal.id}-${idx}`} className="flex items-center gap-2 p-2 bg-white dark:bg-slate-700 rounded-lg border border-slate-100 dark:border-slate-600">
                                         <span className="text-xl">{medal.emoji}</span>
                                         <div>
                                             <div className="text-xs font-bold text-slate-900 dark:text-white leading-tight">{medal.name}</div>
                                             <div className="text-[10px] text-slate-500">{formatMoney(medal.value * medal.count)}</div>
                                         </div>
                                         {medal.count > 1 && <span className="ml-auto text-xs font-bold bg-slate-100 dark:bg-slate-600 px-1.5 rounded">x{medal.count}</span>}
                                     </div>
                                 ))}
                             </div>
                        ) : (
                            <span className="text-sm text-slate-400 italic">No medals unlocked.</span>
                        )}
                    </div>

                    <div className="space-y-3">
                        <h4 className="text-xs font-bold text-slate-500 uppercase tracking-wider">Activities</h4>
                         <ul className="divide-y divide-slate-100 dark:divide-slate-700">
                             {selectedMonth.activities.map(act => (
                                 <li key={act.id} className="py-2 flex justify-between items-center">
                                     <div className="truncate pr-2">
                                         <div className="text-sm font-medium text-slate-900 dark:text-white truncate">{act.name}</div>
                                         <div className="text-xs text-slate-500">{new Date(act.start_date).toLocaleDateString()} • {act.type}</div>
                                     </div>
                                     <div className="text-right text-xs font-mono text-emerald-600 font-bold">
                                         +{formatMoney(act.earned_value || 0)}
                                     </div>
                                 </li>
                             ))}
                             {selectedMonth.activities.length === 0 && <li className="text-sm text-slate-400 italic">No activities.</li>}
                         </ul>
                    </div>
                </div>
            )}
        </Modal>
    </div>
  );
};

const StatPill = ({ icon, value, label }: { icon: string, value: string, label: string }) => (
    <div className="flex flex-col items-center justify-center p-2 bg-slate-50 dark:bg-slate-800/50 rounded-xl border border-slate-100 dark:border-slate-700 transition-colors hover:bg-slate-100 dark:hover:bg-slate-800">
        <span className="text-xl mb-1 grayscale opacity-90">{icon}</span>
        <span className="text-sm font-black text-slate-800 dark:text-slate-200 leading-none">{value}</span>
        <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wide mt-1">{label}</span>
    </div>
);

const DisciplineRow = ({ type, emoji, stats, label, val }: { type: string, emoji: string, stats: DisciplineStats, label: string, val: string }) => (
    <div className="flex items-center justify-between p-4 hover:bg-slate-50 dark:hover:bg-slate-800/30 transition-colors">
        <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-slate-100 dark:bg-slate-800 flex items-center justify-center text-lg">
                {emoji}
            </div>
            <div>
                <div className="text-sm font-bold text-slate-900 dark:text-white">{type}</div>
                <div className="text-[10px] text-slate-500">{stats.count} activities</div>
            </div>
        </div>
        <div className="text-right">
            <div className="text-sm font-mono font-bold text-slate-700 dark:text-slate-300">{val}</div>
            <div className="text-[10px] text-slate-400 uppercase">{label}</div>
        </div>
    </div>
);

const MonthlyHeatmap = ({ data, onMonthClick }: { data: MonthlyStats[], onMonthClick: (m: MonthlyStats) => void }) => {
    // Ensure we have last 12 months, filling in gaps if needed or just showing what we have
    // For visual purposes, a grid of squares.
    // Intensity based on totalValue
    
    const maxVal = Math.max(...data.map(d => d.totalValue), 1000); // Avoid div by zero

    const getColor = (val: number) => {
        const intensity = val / maxVal;
        if (val === 0) return 'bg-slate-100 dark:bg-slate-800';
        if (intensity < 0.2) return 'bg-emerald-100 dark:bg-emerald-900/60';
        if (intensity < 0.4) return 'bg-emerald-200 dark:bg-emerald-800';
        if (intensity < 0.6) return 'bg-emerald-300 dark:bg-emerald-700';
        if (intensity < 0.8) return 'bg-emerald-400 dark:bg-emerald-600';
        return 'bg-emerald-500 dark:bg-emerald-500';
    };

    return (
        <div className="grid grid-cols-4 sm:grid-cols-6 gap-2">
            {data.map((month) => (
                <div 
                    key={month.monthKey}
                    onClick={() => onMonthClick(month)}
                    className={`aspect-square rounded-lg cursor-pointer transition-transform hover:scale-105 hover:shadow-md flex flex-col items-center justify-center border border-slate-50 dark:border-slate-700 ${getColor(month.totalValue)}`}
                    title={`${month.label}: ${formatMoney(month.totalValue)}`}
                >
                    <span className="text-[10px] font-bold text-slate-600 dark:text-slate-300">{month.monthKey.split('-')[1]}</span>
                    {month.totalValue > 0 && <span className="text-[8px] font-mono text-slate-500 dark:text-slate-400">{formatMoney(month.totalValue).replace('$','')}</span>}
                </div>
            ))}
            {data.length === 0 && <div className="col-span-full text-center text-xs text-slate-400 py-4">No monthly data available.</div>}
        </div>
    );
};
