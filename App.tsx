
import React, { useState, useEffect } from 'react';
import { ProfileSection } from './components/ProfileSection';
import { WalletSection } from './components/WalletSection';
import { ActivityFeed } from './components/ActivityFeed';
import { Leaderboard } from './components/Leaderboard';
import { EnduranceSection } from './components/EnduranceSection';
import { MedalsSection } from './components/MedalsSection';
import { Home } from './components/Home';
import { Spinner, Tabs } from './components/ui';
import { processUserData } from './utils';
import { UserData } from './types';

// --- Mock Data Generator ---
const getMockData = (): UserData => {
    const now = new Date();
    const activities = [];
    const sportTypes = ['Run', 'Ride', 'Run', 'Ride', 'Swim', 'Hike', 'Ride'];
    
    // Generate 150 activities over the last year
    for (let i = 0; i < 150; i++) {
        const date = new Date(now.getTime() - (i * 86400000 * 2.5)); 
        const type = sportTypes[i % sportTypes.length];
        const isRide = type === 'Ride';
        const distBase = isRide ? 35000 : 7000;
        
        activities.push({
            id: i,
            name: `${type} Session ${i}`,
            distance: distBase + (Math.random() * distBase * 0.5),
            total_elevation_gain: Math.random() * 800,
            moving_time: (isRide ? 5400 : 2100) + (Math.random() * 1200),
            elapsed_time: (isRide ? 6000 : 2400) + (Math.random() * 1500),
            type: type,
            sport_type: type,
            start_date: date.toISOString(),
            start_date_local: date.toISOString(),
            average_speed: isRide ? 7.5 : 3.0,
            max_speed: isRide ? 15.0 : 5.0,
            kudos_count: Math.floor(Math.random() * 60),
            calories: Math.floor(Math.random() * 800) + 200,
            average_heartrate: 135 + Math.random() * 30,
            max_heartrate: 165 + Math.random() * 20,
            location_country: 'Italy'
        });
    }
    
    // Ensure some big milestones for medals
    activities[0].distance = 42300; activities[0].type = 'Run'; 
    activities[5].distance = 120000; activities[5].type = 'Ride'; 

    const athlete = { 
        id: 12345, 
        firstname: "Demo", 
        lastname: "Athlete", 
        username: "demo_athlete",
        profile: "https://ui-avatars.com/api/?name=Demo+Athlete&background=fc4c02&color=fff" 
    };

    return processUserData(athlete, activities);
};

type AppView = 'home' | 'dashboard';
type DashboardTab = 'overview' | 'wallet' | 'endurance' | 'activities' | 'medals';
type MainTab = 'dashboard' | 'leaderboard';

const App: React.FC = () => {
  const [appView, setAppView] = useState<AppView>('home');
  const [userData, setUserData] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(false);
  const [mainTab, setMainTab] = useState<MainTab>('dashboard');
  const [dashboardView, setDashboardView] = useState<DashboardTab>('overview');
  const [darkMode, setDarkMode] = useState(false);

  useEffect(() => {
    // Check system preference
    if (window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches) {
        setDarkMode(true);
    }
  }, []);

  useEffect(() => {
    if (darkMode) {
        document.documentElement.classList.add('dark');
    } else {
        document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleConnect = () => {
      setLoading(true);
      // Simulate auth flow and data processing
      setTimeout(() => {
          try {
              const data = getMockData();
              setUserData(data);
              setAppView('dashboard');
          } catch (e) {
              console.error(e);
          } finally {
              setLoading(false);
          }
      }, 1500);
  };

  const NavButton = ({ tab, label, icon }: { tab: MainTab, label: string, icon: string }) => (
    <button 
        onClick={() => setMainTab(tab)}
        className={`flex flex-col items-center justify-center w-full py-3 transition-all duration-200 ${mainTab === tab ? 'text-strava scale-105' : 'text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
    >
        <span className="text-2xl mb-1 filter drop-shadow-sm">{icon}</span>
        <span className="text-[10px] uppercase font-bold tracking-widest">{label}</span>
    </button>
  );

  // Loading Screen
  if (loading) {
      return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-white dark:bg-background-dark">
            <Spinner />
            <p className="text-slate-500 text-sm font-medium animate-pulse mt-4">Syncing with Strava...</p>
        </div>
      );
  }

  // Home (Landing) View
  if (appView === 'home') {
      return (
          <div className="min-h-screen flex flex-col bg-gradient-to-b from-orange-50 to-white dark:from-slate-900 dark:to-background-dark">
               <div className="w-full flex justify-end p-6">
                    <button 
                        onClick={() => setDarkMode(!darkMode)} 
                        className="p-2 rounded-full bg-white/50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-strava transition-colors border border-slate-200 dark:border-slate-700"
                    >
                        {darkMode ? '☀️' : '🌙'}
                    </button>
               </div>
               <Home onConnect={handleConnect} />
          </div>
      );
  }

  // Dashboard / Leaderboard View
  return (
    <div className="min-h-screen pb-24 md:pb-10 transition-colors duration-300">
      {/* Top Navigation */}
      <nav className="sticky top-0 z-50 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl border-b border-slate-200 dark:border-slate-800 px-4 py-3 shadow-sm transition-colors duration-300">
        <div className="max-w-6xl mx-auto flex justify-between items-center">
            <div className="flex items-center gap-3 cursor-pointer" onClick={() => setMainTab('dashboard')}>
                <div className="w-9 h-9 bg-gradient-to-tr from-strava to-orange-500 rounded-xl flex items-center justify-center text-white font-black text-lg shadow-lg shadow-orange-500/20 transform transition-transform hover:rotate-3">L</div>
                <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white hidden sm:inline">League<span className="text-strava">.</span></span>
            </div>
            
            <div className="flex items-center gap-3">
                 {/* Desktop Main Nav */}
                 <div className="hidden md:flex gap-1 bg-slate-100 dark:bg-slate-800 p-1 rounded-full mr-2">
                     <button onClick={() => setMainTab('dashboard')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${mainTab === 'dashboard' ? 'bg-white dark:bg-slate-700 text-strava shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Dashboard</button>
                     <button onClick={() => setMainTab('leaderboard')} className={`px-4 py-1.5 rounded-full text-sm font-bold transition-all ${mainTab === 'leaderboard' ? 'bg-white dark:bg-slate-700 text-strava shadow-sm' : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'}`}>Leaderboard</button>
                 </div>

                 <button 
                    onClick={() => setDarkMode(!darkMode)} 
                    className="p-2 rounded-full bg-slate-50 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-strava transition-colors border border-slate-200 dark:border-slate-700"
                    aria-label="Toggle Dark Mode"
                >
                    {darkMode ? '☀️' : '🌙'}
                </button>
            </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-6xl mx-auto p-4 md:p-6 space-y-8">
        {userData && (
            <div className="animate-in fade-in duration-500 slide-in-from-bottom-2">
                {mainTab === 'dashboard' ? (
                    <>
                        {/* Dashboard Sub-Navigation */}
                        <div className="mb-6 overflow-x-auto no-scrollbar">
                            <Tabs 
                                activeTab={dashboardView}
                                onChange={(id) => setDashboardView(id)}
                                tabs={[
                                    { id: 'overview', label: 'Overview', icon: '👤' },
                                    { id: 'endurance', label: 'Endurance', icon: '📈' },
                                    { id: 'wallet', label: 'Wallet', icon: '💰' },
                                    { id: 'activities', label: 'Activities', icon: '👟' },
                                    { id: 'medals', label: 'Medals', icon: '🏆' },
                                ]}
                            />
                        </div>

                        {/* Views */}
                        <div className="space-y-6">
                            {dashboardView === 'overview' && (
                                <>
                                    <ProfileSection data={userData} />
                                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                                        <WalletSection wallet={userData.wallet} history={userData.monthlyStats} />
                                        <ActivityFeed activities={userData.activities} />
                                    </div>
                                </>
                            )}

                            {dashboardView === 'endurance' && (
                                <EnduranceSection enduranceStats={userData.enduranceStats} />
                            )}

                            {dashboardView === 'wallet' && (
                                <WalletSection wallet={userData.wallet} history={userData.monthlyStats} />
                            )}

                            {dashboardView === 'activities' && (
                                <ActivityFeed activities={userData.activities} />
                            )}

                            {dashboardView === 'medals' && (
                                <MedalsSection medals={userData.medals} />
                            )}
                        </div>
                    </>
                ) : (
                    <div className="max-w-4xl mx-auto">
                         <Leaderboard userData={userData} />
                    </div>
                )}
            </div>
        )}
      </main>

      {/* Mobile Bottom Bar */}
      <div className="fixed bottom-0 left-0 right-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-xl border-t border-slate-200 dark:border-slate-800 md:hidden pb-safe z-40">
        <div className="flex justify-around items-center h-16 px-2">
            <NavButton tab="dashboard" label="Hub" icon="🏠" />
            <NavButton tab="leaderboard" label="Ranks" icon="🏆" />
        </div>
      </div>
    </div>
  );
};

export default App;
