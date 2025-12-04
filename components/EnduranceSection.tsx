
import React, { useEffect, useRef, useState } from 'react';
import { Chart } from 'chart.js';
import { UserData } from '../types';
import { Card, Tabs } from './ui';

interface Props {
  enduranceStats: UserData['enduranceStats'];
}

type MetricType = 'distance' | 'elevation' | 'time';
type DisciplineType = 'all' | 'run' | 'ride';

export const EnduranceSection: React.FC<Props> = ({ enduranceStats }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const chartInstance = useRef<Chart | null>(null);
  const [activeMetric, setActiveMetric] = useState<MetricType>('distance');
  const [activeDiscipline, setActiveDiscipline] = useState<DisciplineType>('all');
  const [compareMode, setCompareMode] = useState(false);

  useEffect(() => {
    if (!canvasRef.current) return;

    if (chartInstance.current) {
        chartInstance.current.destroy();
    }

    const ctx = canvasRef.current.getContext('2d');
    if (!ctx) return;

    // Select the correct dataset based on discipline
    const currentStats = enduranceStats[activeDiscipline];
    if (!currentStats || !currentStats.dates) return;

    const metricDataMap = {
        distance: { label: 'Distance (km)', color: '#3b82f6', data: currentStats.distance },
        elevation: { label: 'Elevation (m)', color: '#f97316', data: currentStats.elevation },
        time: { label: 'Time (h)', color: '#8b5cf6', data: currentStats.time },
    };

    const currentConfig = metricDataMap[activeMetric];
    
    // Generate mock comparison data if active (just for visual demo)
    const comparisonData = compareMode 
        ? currentConfig.data.map(v => v ? v * (0.8 + Math.random() * 0.4) : null) 
        : [];

    const datasets: any[] = [
        {
            label: 'You',
            data: currentConfig.data,
            borderColor: currentConfig.color,
            backgroundColor: 'transparent',
            borderWidth: 2,
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
        }
    ];

    if (compareMode) {
        datasets.push({
            label: 'Avg Athlete',
            data: comparisonData,
            borderColor: '#94a3b8',
            backgroundColor: 'transparent',
            borderWidth: 2,
            borderDash: [5, 5],
            tension: 0.4,
            pointRadius: 0,
            pointHoverRadius: 4
        });
    }

    chartInstance.current = new Chart(ctx, {
        type: 'line',
        data: {
            labels: currentStats.dates,
            datasets: datasets
        },
        options: {
            responsive: true,
            maintainAspectRatio: false,
            interaction: {
                mode: 'index',
                intersect: false,
            },
            plugins: {
                legend: { 
                    display: compareMode,
                    position: 'top',
                    labels: { usePointStyle: true, boxWidth: 8 } 
                },
                tooltip: {
                    mode: 'index',
                    intersect: false,
                    callbacks: {
                        title: (items) => {
                             // Just show date
                             return items[0].label;
                        }
                    }
                }
            },
            scales: {
                x: {
                    grid: { display: false },
                    ticks: { maxTicksLimit: 6, maxRotation: 0, color: '#94a3b8', font: { size: 10 } },
                    border: { display: false }
                },
                y: {
                    grid: { color: 'rgba(148, 163, 184, 0.1)' },
                    ticks: { color: '#94a3b8', font: { size: 10 } },
                    border: { display: false },
                    beginAtZero: true
                }
            }
        }
    });

    return () => {
        if (chartInstance.current) chartInstance.current.destroy();
    };
  }, [activeMetric, activeDiscipline, compareMode, enduranceStats]);

  return (
    <Card title="Endurance Trends" action={
        <button 
            onClick={() => setCompareMode(!compareMode)}
            className={`text-xs font-bold px-3 py-1.5 rounded-lg transition-colors ${compareMode ? 'bg-indigo-100 text-indigo-700 dark:bg-indigo-900/40 dark:text-indigo-300' : 'bg-slate-100 text-slate-600 dark:bg-slate-800 dark:text-slate-400'}`}
        >
            {compareMode ? 'Comparing' : 'Compare'}
        </button>
    }>
        <div className="space-y-4 mb-4">
            {/* Metric Tabs */}
            <Tabs 
                activeTab={activeMetric} 
                onChange={(id) => setActiveMetric(id)} 
                tabs={[
                    { id: 'distance', label: 'Distance' },
                    { id: 'elevation', label: 'Elevation' },
                    { id: 'time', label: 'Time' }
                ]} 
            />
            
            {/* Discipline Toggles */}
            <div className="flex gap-2 justify-center sm:justify-start">
                {(['all', 'run', 'ride'] as const).map((d) => (
                    <button
                        key={d}
                        onClick={() => setActiveDiscipline(d)}
                        className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider transition-all border ${
                            activeDiscipline === d
                                ? 'bg-slate-800 text-white border-slate-800 dark:bg-white dark:text-slate-900'
                                : 'bg-transparent text-slate-500 border-slate-200 dark:border-slate-700 hover:border-slate-400'
                        }`}
                    >
                        {d}
                    </button>
                ))}
            </div>
        </div>

        <div className="h-64 w-full relative">
            <canvas ref={canvasRef}></canvas>
        </div>
        <div className="mt-3 text-center">
            <p className="text-xs text-slate-400">50-day moving average ({activeDiscipline})</p>
        </div>
    </Card>
  );
};
