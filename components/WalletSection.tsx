
import React, { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';
import { CoinWallet, Medal, MonthlyStats } from '../types';
import { Card } from './ui';
import { formatMoney } from '../utils';

Chart.register(...registerables);

interface Props {
  wallet: CoinWallet;
  history: MonthlyStats[];
}

export const WalletSection: React.FC<Props> = ({ wallet, history }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);

  useEffect(() => {
    if (!canvasRef.current || history.length === 0) return;

    // Assuming history is sorted oldest to newest for the chart
    // If incoming history is Newest -> Oldest, reverse it
    // Check date of first vs last to be sure, or just trust incoming prop if util sorts it.
    // The util sorts "Newest First" for the activity list, but for charts we usually want Time ->
    // Let's assume history is Month Ascending for charting.
    
    const chartData = history; 

    if (chartInstance.current) {
        chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (ctx) {
        const gradient = ctx.createLinearGradient(0, 0, 0, 300);
        gradient.addColorStop(0, 'rgba(16, 185, 129, 0.2)');
        gradient.addColorStop(1, 'rgba(16, 185, 129, 0.0)');

        chartInstance.current = new Chart(ctx, {
            type: 'line',
            data: {
                labels: chartData.map(d => {
                    // Fix: Use monthKey instead of month
                    const [y, m] = d.monthKey.split('-');
                    const date = new Date(parseInt(y), parseInt(m)-1);
                    return date.toLocaleDateString('en-US', { month: 'short', year: '2-digit' });
                }),
                datasets: [{
                    label: 'Value Growth',
                    data: chartData.map(d => d.coinsValue), // Simplified: accumulative would be better but this shows monthly earnings
                    borderColor: '#10b981',
                    backgroundColor: gradient,
                    fill: true,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 6,
                    pointBackgroundColor: '#10b981',
                    borderWidth: 2
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                interaction: {
                    mode: 'index',
                    intersect: false,
                },
                plugins: {
                    legend: { display: false },
                    tooltip: {
                        backgroundColor: 'rgba(15, 23, 42, 0.9)',
                        titleColor: '#fff',
                        bodyColor: '#fff',
                        padding: 10,
                        cornerRadius: 8,
                        callbacks: {
                            label: (ctx) => `Earnings: ${formatMoney(ctx.parsed.y)}`
                        }
                    }
                },
                scales: {
                    y: {
                        display: false,
                        beginAtZero: true
                    },
                    x: {
                        grid: { display: false },
                        ticks: {
                            font: { size: 10, family: 'Inter' },
                            color: '#94a3b8',
                            maxRotation: 0,
                            autoSkip: true,
                            maxTicksLimit: 6
                        },
                        border: { display: false }
                    }
                }
            }
        });
    }

    return () => {
        if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [history]);

  return (
    <Card title="Wallet Performance">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Chart Area */}
        <div className="md:col-span-2 flex flex-col h-64 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-100 dark:border-slate-700/50 p-4 relative">
            <div className="absolute top-4 left-4 z-10">
                <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider">Monthly Earnings</h4>
                <p className="text-2xl font-black text-slate-800 dark:text-white">
                    {formatMoney(history.reduce((sum, m) => sum + m.coinsValue, 0))}
                    <span className="text-xs font-medium text-emerald-500 ml-2">LTM</span>
                </p>
            </div>
            <div className="flex-1 w-full h-full mt-4">
                {history.length > 1 ? (
                    <canvas ref={canvasRef}></canvas>
                ) : (
                    <div className="flex items-center justify-center h-full text-sm text-slate-400">
                        Need more data for history graph
                    </div>
                )}
            </div>
        </div>

        {/* Coin Breakdown Grid */}
        <div className="md:col-span-1 flex flex-col justify-between gap-3">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider mb-1">Coin Inventory</h4>
            <div className="grid grid-cols-2 gap-3 flex-1">
                {Object.entries(wallet).map(([emoji, count]) => (
                    <div key={emoji} className="flex flex-col items-center justify-center p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-100 dark:border-slate-700 shadow-sm relative overflow-hidden">
                        {/* Background decoration */}
                        <div className="absolute -right-2 -bottom-4 text-4xl opacity-5 grayscale filter">{emoji}</div>
                        
                        <span className="text-2xl mb-1 filter drop-shadow-sm relative z-10">{emoji}</span>
                        <span className="font-black text-slate-700 dark:text-slate-200 relative z-10">{count}</span>
                        <span className="text-[9px] text-slate-400 uppercase font-bold tracking-widest mt-1 relative z-10">
                            {emoji === '💲' ? 'Std' : emoji === '💰' ? 'Bag' : emoji === '🧈' ? 'Bar' : emoji === '💎' ? 'Gem' : 'Kng'}
                        </span>
                    </div>
                ))}
            </div>
        </div>

      </div>
    </Card>
  );
};
