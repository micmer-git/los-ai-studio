
import React, { useEffect, useState } from 'react';

interface Props {
    onConnect: () => void;
}

export const Home: React.FC<Props> = ({ onConnect }) => {
    const [visible, setVisible] = useState(false);

    useEffect(() => {
        const t = setTimeout(() => setVisible(true), 100);
        return () => clearTimeout(t);
    }, []);

    return (
        <div className="flex flex-col items-center justify-center py-12 md:py-20 text-center max-w-5xl mx-auto px-6">
            <div className={`transition-all duration-1000 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                <div className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 text-strava dark:text-orange-400 text-xs font-bold tracking-widest uppercase mb-8">
                    <span className="w-2 h-2 rounded-full bg-strava animate-pulse"></span>
                    Season 2025 Live
                </div>

                <h1 className="text-5xl md:text-7xl font-black text-slate-900 dark:text-white mb-6 leading-tight tracking-tight">
                    Your Sweat. <br />
                    <span className="bg-clip-text text-transparent bg-gradient-to-r from-strava to-orange-500">Gamified.</span>
                </h1>

                <p className="text-lg md:text-xl text-slate-500 dark:text-slate-400 max-w-2xl mx-auto mb-12 leading-relaxed">
                    Turn miles into <span className="font-bold text-slate-700 dark:text-slate-200">Coins</span>, unlock <span className="font-bold text-slate-700 dark:text-slate-200">Obsidian Medals</span>, and climb from <span className="font-bold text-slate-700 dark:text-slate-200">Wood</span> to <span className="font-bold text-slate-700 dark:text-slate-200">Prestige 👑</span>.
                </p>

                <div className="flex flex-col sm:flex-row gap-4 justify-center mb-20">
                    <button 
                        onClick={onConnect}
                        className="px-8 py-4 rounded-xl bg-gradient-to-r from-strava to-orange-600 text-white font-bold text-lg shadow-lg shadow-orange-500/30 hover:scale-105 transition-transform active:scale-95"
                    >
                        Enter the League
                    </button>
                    <button 
                        onClick={() => {}} // Just scroll to content ideally
                        className="px-8 py-4 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-200 font-bold text-lg shadow-sm hover:bg-slate-50 dark:hover:bg-slate-700 transition-colors"
                    >
                        Learn More
                    </button>
                </div>
            </div>

            {/* Feature Grid */}
            <div className={`grid grid-cols-1 md:grid-cols-3 gap-6 w-full transition-all duration-1000 delay-300 transform ${visible ? 'translate-y-0 opacity-100' : 'translate-y-10 opacity-0'}`}>
                
                {/* Card 1: Ranks */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-20 bg-orange-50 dark:bg-orange-900/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-xl flex items-center justify-center text-2xl mb-6">🛡️</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Dynamic Ranks</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Climb from Wood to Elite based on training hours. Prestige levels for the truly dedicated.
                        </p>
                        <div className="mt-6 flex gap-2 opacity-50">
                            <span>🪵</span><span>🥉</span><span>🥈</span><span>🥇</span><span>💎</span>
                        </div>
                    </div>
                </div>

                {/* Card 2: Medals */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-20 bg-purple-50 dark:bg-purple-900/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-purple-50 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 rounded-xl flex items-center justify-center text-2xl mb-6">🏅</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Rare Medals</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Unlock achievements for volume, intensity, and consistency. Hunt for the Obsidian tier.
                        </p>
                        <div className="mt-6 flex gap-2">
                            <span className="bg-slate-100 dark:bg-slate-700 px-2 py-1 rounded text-xs font-bold text-slate-600 dark:text-slate-300">Verdant</span>
                            <span className="bg-purple-100 dark:bg-purple-900/40 px-2 py-1 rounded text-xs font-bold text-purple-700 dark:text-purple-300">Amethyst</span>
                        </div>
                    </div>
                </div>

                {/* Card 3: Economy */}
                <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-100 dark:border-slate-700 shadow-xl shadow-slate-200/50 dark:shadow-none text-left relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-20 bg-emerald-50 dark:bg-emerald-900/10 rounded-bl-full -mr-10 -mt-10 transition-transform group-hover:scale-110"></div>
                    <div className="relative z-10">
                        <div className="w-12 h-12 bg-emerald-50 dark:bg-emerald-900/30 text-emerald-600 dark:text-emerald-400 rounded-xl flex items-center justify-center text-2xl mb-6">💰</div>
                        <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2">Activity Wallet</h3>
                        <p className="text-slate-500 dark:text-slate-400 text-sm leading-relaxed">
                            Every km and calorie mints coins. Build your net worth and compete on the leaderboard.
                        </p>
                        <div className="mt-6 flex items-center gap-3 font-mono text-sm font-bold text-emerald-600 dark:text-emerald-400">
                            <span>💲 200</span>
                            <span>💎 10k</span>
                            <span>👑 50k</span>
                        </div>
                    </div>
                </div>

            </div>
        </div>
    );
};
