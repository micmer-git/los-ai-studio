
import React, { useState, useMemo } from 'react';
import { Activity } from '../types';
import { Card } from './ui';
import { formatDuration, formatKm, formatMoney } from '../utils';

interface Props {
  activities: Activity[];
}

type FilterType = 'all' | 'run' | 'ride' | 'swim';

export const ActivityFeed: React.FC<Props> = ({ activities }) => {
  const [filter, setFilter] = useState<FilterType>('all');

  const filteredActivities = useMemo(() => {
      if (filter === 'all') return activities;
      return activities.filter(a => (a.type || '').toLowerCase().includes(filter));
  }, [activities, filter]);

  return (
    <Card title="Recent Activities" className="h-full flex flex-col">
      <div className="flex gap-2 mb-4 overflow-x-auto no-scrollbar pb-2">
          <FilterChip label="All" active={filter === 'all'} onClick={() => setFilter('all')} />
          <FilterChip label="Runs" active={filter === 'run'} onClick={() => setFilter('run')} />
          <FilterChip label="Rides" active={filter === 'ride'} onClick={() => setFilter('ride')} />
          <FilterChip label="Swims" active={filter === 'swim'} onClick={() => setFilter('swim')} />
      </div>

      <div className="flow-root flex-1 -mx-2">
        <ul role="list" className="divide-y divide-slate-100 dark:divide-slate-700/50">
        {filteredActivities.slice(0, 10).map((activity) => {
            const isRide = (activity.type || '').toLowerCase().includes('ride');
            const isRun = (activity.type || '').toLowerCase().includes('run');
            const isSwim = (activity.type || '').toLowerCase().includes('swim');
            const icon = isRide ? '🚴' : isRun ? '🏃' : isSwim ? '🏊' : '🏋️';
            const date = new Date(activity.start_date);
            
            // Coins & Medals
            const coins = activity.earned_coins || [];
            const medals = activity.earned_medals || [];

            return (
            <li key={activity.id} className="p-3 hover:bg-slate-50 dark:hover:bg-slate-800/50 rounded-xl transition-colors group">
                <div className="flex items-start space-x-3">
                    <div className="flex-shrink-0 mt-1">
                        <span className="inline-flex items-center justify-center h-10 w-10 rounded-full bg-slate-100 dark:bg-slate-800 text-xl shadow-sm ring-1 ring-slate-900/5 dark:ring-white/10 group-hover:scale-110 transition-transform">
                            {icon}
                        </span>
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex justify-between items-start">
                            <p className="text-sm font-bold text-slate-900 dark:text-slate-100 truncate pr-2 group-hover:text-strava transition-colors">
                                {activity.name}
                            </p>
                            <div className="text-right">
                                <span className="text-[10px] text-slate-400 whitespace-nowrap block">
                                    {date.toLocaleDateString(undefined, { month: 'short', day: 'numeric' })}
                                </span>
                                {activity.earned_value && activity.earned_value > 0 && (
                                    <span className="text-[10px] font-bold text-emerald-600">+{formatMoney(activity.earned_value)}</span>
                                )}
                            </div>
                        </div>
                        
                        <div className="flex flex-wrap items-center gap-y-1 gap-x-3 text-xs text-slate-500 dark:text-slate-400 mt-1">
                            <span className="font-mono font-medium">{formatKm(activity.distance)}</span>
                            {activity.total_elevation_gain > 0 && (
                                <span className="flex items-center gap-0.5"><span className="opacity-50">▲</span> {Math.round(activity.total_elevation_gain)}m</span>
                            )}
                            <span className="flex items-center gap-0.5"><span className="opacity-50">⏱</span> {formatDuration(activity.moving_time)}</span>
                        </div>

                        {(coins.length > 0 || medals.length > 0) && (
                            <div className="mt-2 flex flex-wrap gap-1.5">
                                {coins.map((c, i) => (
                                    <span key={`coin-${i}`} className="text-sm" title="Coin earned">{c}</span>
                                ))}
                                {medals.map(m => (
                                    <span key={`medal-${m.id}`} className="inline-flex items-center px-1.5 py-0.5 rounded text-[9px] font-bold bg-orange-50 text-orange-700 dark:bg-orange-900/20 dark:text-orange-300 border border-orange-100 dark:border-orange-900/30 uppercase tracking-wide" title={m.description}>
                                        {m.emoji} {m.name}
                                    </span>
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </li>
            )
        })}
        </ul>
        
        {filteredActivities.length === 0 && (
            <div className="text-center py-12 flex flex-col items-center justify-center h-full">
                <div className="text-4xl mb-2 opacity-50">🦗</div>
                <p className="text-slate-500 font-medium">No activities found.</p>
            </div>
        )}
      </div>
    </Card>
  );
};

const FilterChip = ({ label, active, onClick }: { label: string, active: boolean, onClick: () => void }) => (
    <button
        onClick={onClick}
        className={`px-3 py-1 rounded-full text-xs font-bold transition-all border ${
            active 
            ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900' 
            : 'bg-white text-slate-500 border-slate-200 hover:border-slate-300 dark:bg-slate-800 dark:text-slate-400 dark:border-slate-700'
        }`}
    >
        {label}
    </button>
);
