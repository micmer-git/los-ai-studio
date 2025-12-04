
import React, { useState, useMemo } from 'react';
import { Medal } from '../types';
import { Badge } from './ui';
import { MEDAL_RARITY_CONFIG, formatMoney } from '../utils';

interface Props {
  medals: Medal[];
}

export const MedalsSection: React.FC<Props> = ({ medals }) => {
  const [filter, setFilter] = useState('all');

  const rarityKeys = Object.keys(MEDAL_RARITY_CONFIG);

  const filteredMedals = useMemo(() => {
      if (filter === 'all') return medals;
      return medals.filter(m => m.rarity === filter);
  }, [medals, filter]);

  const totalValue = useMemo(() => {
      return medals.reduce((sum, m) => sum + (m.count * m.value), 0);
  }, [medals]);

  return (
    <div className="space-y-6">
        {/* Summary Header */}
        <div className="bg-gradient-to-r from-slate-900 to-slate-800 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-6 text-white shadow-lg relative overflow-hidden">
            <div className="absolute top-0 right-0 p-32 bg-white/5 rounded-full blur-3xl -mr-16 -mt-16 pointer-events-none"></div>
            <div className="relative z-10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                <div>
                    <h2 className="text-2xl font-bold">Trophy Case</h2>
                    <p className="text-slate-400 text-sm">Collection Value</p>
                </div>
                <div className="text-right">
                    <div className="text-3xl font-black tracking-tight text-emerald-400">{formatMoney(totalValue)}</div>
                    <div className="text-xs font-bold uppercase tracking-wider text-slate-500">{medals.reduce((a,b) => a + b.count, 0)} Total Medals</div>
                </div>
            </div>
        </div>

        {/* Filters */}
        <div className="flex flex-wrap gap-2">
            <button
                onClick={() => setFilter('all')}
                className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all ${filter === 'all' ? 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
            >
                All
            </button>
            {rarityKeys.map(rarity => (
                <button
                    key={rarity}
                    onClick={() => setFilter(rarity)}
                    className={`px-3 py-1.5 rounded-lg text-xs font-bold border transition-all capitalize ${filter === rarity ? 'bg-white dark:bg-slate-700 border-slate-300 dark:border-slate-500 shadow-sm' : 'border-transparent text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'}`}
                >
                    {rarity}
                </button>
            ))}
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {filteredMedals.map((medal) => (
              <div key={medal.id} className={`relative group flex flex-col p-4 rounded-2xl border bg-white dark:bg-slate-800 transition-all hover:shadow-md hover:-translate-y-1 ${MEDAL_RARITY_CONFIG[medal.rarity as keyof typeof MEDAL_RARITY_CONFIG]?.border || 'border-slate-100 dark:border-slate-700'}`}>
                <div className="flex justify-between items-start mb-3">
                    <span className="text-4xl filter drop-shadow-sm group-hover:scale-110 transition-transform duration-200">{medal.emoji}</span>
                    {medal.count > 0 ? (
                        <span className="bg-slate-900 text-white text-[10px] font-black px-2 py-1 rounded-md shadow-sm">
                            x{medal.count}
                        </span>
                    ) : (
                        <span className="bg-slate-100 text-slate-400 text-[10px] font-bold px-2 py-1 rounded-md uppercase tracking-wider">
                            Locked
                        </span>
                    )}
                </div>
                
                <div className="flex-1">
                    <h3 className="font-bold text-slate-900 dark:text-white text-sm leading-tight mb-1">{medal.name}</h3>
                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">{medal.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-700/50 flex items-center justify-between">
                     <Badge className={MEDAL_RARITY_CONFIG[medal.rarity as keyof typeof MEDAL_RARITY_CONFIG]?.color.replace('bg-', 'bg-opacity-20 bg-')}>
                        {medal.rarity}
                     </Badge>
                     <span className="text-xs font-mono text-slate-400 font-medium">{formatMoney(medal.value)}</span>
                </div>
              </div>
            ))}
            
            {filteredMedals.length === 0 && (
                <div className="col-span-full py-12 text-center text-slate-400">
                    No medals found in this category.
                </div>
            )}
        </div>
    </div>
  );
};
