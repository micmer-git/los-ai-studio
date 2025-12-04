
import React, { useState, useEffect } from 'react';
import { Card } from './ui';
import { LeaderboardEntry, UserData, RankConfig } from '../types';
import { formatMoney } from '../utils';

// Mock generator for leaderboard (since we don't have backend peer data in this demo)
const generateMockLeaderboard = (currentUser: UserData): LeaderboardEntry[] => {
    const botRank: RankConfig = { name: 'Bot', emoji: '🤖', minHours: 0, tier: 'Bot' };
    
    const bots: LeaderboardEntry[] = [
        { userId: '2', displayName: 'Sarah Connor', level: 45, rank: botRank, rankEmoji: '🥈', walletValue: 980000, coins: 420, medals: 22, lastActive: new Date().toISOString() },
        { userId: '3', displayName: 'John Doe', level: 30, rank: botRank, rankEmoji: '🥉', walletValue: 650000, coins: 150, medals: 10, lastActive: new Date(Date.now() - 86400000).toISOString() },
        { userId: '4', displayName: 'Ellen Ripley', level: 28, rank: botRank, rankEmoji: '🏅', walletValue: 500000, coins: 120, medals: 8, lastActive: new Date(Date.now() - 172800000).toISOString() },
        { userId: '5', displayName: 'Neo', level: 15, rank: botRank, rankEmoji: '🏅', walletValue: 250000, coins: 50, medals: 3, lastActive: new Date(Date.now() - 300000).toISOString() },
    ];

    // Insert current user
    const userEntry: LeaderboardEntry = {
        userId: String(currentUser.athlete.id),
        displayName: `${currentUser.athlete.firstname} ${currentUser.athlete.lastname}`,
        level: currentUser.level,
        rankEmoji: currentUser.rank.emoji,
        rank: currentUser.rank,
        walletValue: currentUser.walletValue,
        coins: Object.values(currentUser.wallet).reduce((a, b) => a + b, 0),
        medals: currentUser.medals.reduce((a: number, b: any) => a + b.count, 0),
        lastActive: new Date().toISOString()
    };

    return [userEntry, ...bots].sort((a, b) => b.walletValue - a.walletValue).map((entry, idx) => ({
        ...entry,
        rankEmoji: idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : '🏅' // Recalculate rank emoji based on sort
    }));
};

interface Props {
    userData: UserData;
}

export const Leaderboard: React.FC<Props> = ({ userData }) => {
  const [entries, setEntries] = useState<LeaderboardEntry[]>([]);
  
  useEffect(() => {
    if (userData) {
        setEntries(generateMockLeaderboard(userData));
    }
  }, [userData]);

  return (
    <Card title="Global Standings" className="overflow-hidden">
      <div className="overflow-x-auto -mx-5 -mb-5">
        <table className="w-full text-sm text-left border-collapse">
          <thead className="text-xs text-slate-500 dark:text-slate-400 uppercase bg-slate-50 dark:bg-slate-800/50 border-b border-slate-200 dark:border-slate-700">
            <tr>
              <th className="px-6 py-4 font-semibold">Rank</th>
              <th className="px-6 py-4 font-semibold">Athlete</th>
              <th className="px-6 py-4 text-center font-semibold">Level</th>
              <th className="px-6 py-4 text-right font-semibold">Net Worth</th>
              <th className="px-6 py-4 text-right font-semibold">Awards</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-700/50">
            {entries.map((entry, index) => {
              const isMe = entry.userId === String(userData.athlete.id);
              return (
              <tr key={entry.userId} className={`transition-colors ${isMe ? 'bg-orange-50/50 dark:bg-orange-900/10' : 'hover:bg-slate-50 dark:hover:bg-slate-800/30'}`}>
                <td className="px-6 py-4 font-bold text-slate-400 w-16 text-center">
                    {index < 3 ? <span className="text-xl">{entry.rankEmoji}</span> : `#${index + 1}`}
                </td>
                <td className="px-6 py-4">
                    <div className="flex items-center">
                        <div className={`h-8 w-8 rounded-full flex items-center justify-center text-sm font-bold mr-3 ${isMe ? 'bg-gradient-to-br from-strava to-orange-600 text-white shadow-md' : 'bg-slate-200 dark:bg-slate-700 text-slate-600 dark:text-slate-300'}`}>
                            {entry.displayName.charAt(0)}
                        </div>
                        <div>
                            <div className={`font-medium ${isMe ? 'text-strava' : 'text-slate-900 dark:text-white'}`}>
                                {entry.displayName} {isMe && <span className="text-[10px] bg-orange-100 text-orange-700 px-1.5 rounded ml-1">YOU</span>}
                            </div>
                            <div className="text-xs text-slate-500">Active {new Date(entry.lastActive).toLocaleDateString()}</div>
                        </div>
                    </div>
                </td>
                <td className="px-6 py-4 text-center">
                    <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-slate-100 text-slate-800 dark:bg-slate-700 dark:text-slate-300">
                        Lvl {entry.level}
                    </span>
                </td>
                <td className="px-6 py-4 text-right font-mono font-bold text-emerald-600 dark:text-emerald-400 tracking-tight">
                    {formatMoney(entry.walletValue)}
                </td>
                <td className="px-6 py-4 text-right text-xs text-slate-500 dark:text-slate-400">
                   <div className="flex items-center justify-end gap-3">
                        <span className="flex items-center gap-1" title="Coins">🟡 {entry.coins}</span>
                        <span className="flex items-center gap-1" title="Medals">🏅 {entry.medals}</span>
                   </div>
                </td>
              </tr>
            )})}
          </tbody>
        </table>
      </div>
    </Card>
  );
};
