"use client";
// Visual summaries: weekly heatmap and today sparkline
// Lightweight SVG-based charts with good contrast
import React, { useMemo } from 'react';
import { WeeklyAvailability } from '../utils/availabilityCalculator';

interface MiniAvailabilityProps {
  weeklyData: WeeklyAvailability;
  todaySparkline: number[];
}

// Color scale for heatmap (4-step blue-purple ramp with good contrast on dark)
function getHeatmapColor(percentage: number): string {
  if (percentage >= 75) return 'rgb(59, 130, 246)'; // blue-500
  if (percentage >= 50) return 'rgb(99, 102, 241)'; // indigo-500
  if (percentage >= 25) return 'rgb(139, 92, 246)'; // violet-500
  return 'rgb(168, 85, 247)'; // purple-500
}

export function MiniAvailability({ weeklyData, todaySparkline }: MiniAvailabilityProps) {
  const days = ['M', 'T', 'W', 'Th', 'F'];
  const cellSize = 16;
  const gap = 2;
  
  // Memoize heatmap rendering
  const heatmapCells = useMemo(() => {
    const cells: JSX.Element[] = [];
    days.forEach((day, dayIndex) => {
      const dayData = weeklyData[day] || [];
      dayData.forEach((percentage, hourIndex) => {
        const x = dayIndex * (cellSize + gap);
        const y = hourIndex * (cellSize + gap);
        const color = getHeatmapColor(percentage);
        
        cells.push(
          <rect
            key={`${day}-${hourIndex}`}
            x={x}
            y={y}
            width={cellSize}
            height={cellSize}
            fill={color}
            className="transition-opacity hover:opacity-80"
          >
            <title>{`${day} ${hourIndex + 8}:00 - ${percentage}% free`}</title>
          </rect>
        );
      });
    });
    return cells;
  }, [weeklyData, days]);

  // Memoize sparkline path
  const sparklinePath = useMemo(() => {
    const width = 280;
    const height = 40;
    const segmentWidth = width / 24;
    
    const points = todaySparkline.map((percentage, index) => {
      const x = index * segmentWidth + segmentWidth / 2;
      const y = height - (percentage / 100) * height;
      return `${x},${y}`;
    }).join(' ');
    
    return `M ${points}`;
  }, [todaySparkline]);

  const heatmapWidth = days.length * (cellSize + gap) - gap;
  const heatmapHeight = 14 * (cellSize + gap) - gap; // 14 hours (8-21)

  return (
    <div className="space-y-6">
      {/* Weekly heatmap */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-200">Weekly Availability</h3>
        <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
          <div className="flex items-center gap-3">
            {/* Day labels */}
            <div className="flex flex-col gap-0.5 text-xs text-slate-400">
              <div className="h-4"></div>
              {days.map((day) => (
                <div key={day} style={{ height: cellSize, lineHeight: `${cellSize}px` }}>
                  {day}
                </div>
              ))}
            </div>
            
            {/* Heatmap */}
            <div className="overflow-x-auto">
              <svg
                width={heatmapWidth}
                height={heatmapHeight + 20}
                className="min-w-full"
                role="img"
                aria-label="Weekly availability heatmap showing room availability across weekdays and hours"
              >
                {/* Hour labels */}
                <g>
                  {Array.from({ length: 14 }, (_, i) => {
                    const hour = i + 8;
                    // Show every other hour label to avoid crowding
                    if (hour % 2 === 0) {
                      return (
                        <text
                          key={hour}
                          x={i * (cellSize + gap) + cellSize / 2}
                          y={heatmapHeight + 15}
                          fontSize="10"
                          fill="rgb(148, 163, 184)"
                          textAnchor="middle"
                        >
                          {hour}
                        </text>
                      );
                    }
                    return null;
                  })}
                </g>
                
                {/* Heatmap cells */}
                <g transform="translate(0, 0)">
                  {heatmapCells}
                </g>
              </svg>
            </div>
          </div>
          
          {/* Color scale legend */}
          <div className="flex items-center gap-2 mt-3 text-xs text-slate-400">
            <span>Low</span>
            <div className="flex gap-1">
              <div className="w-4 h-3 rounded" style={{ backgroundColor: 'rgb(168, 85, 247)' }}></div>
              <div className="w-4 h-3 rounded" style={{ backgroundColor: 'rgb(139, 92, 246)' }}></div>
              <div className="w-4 h-3 rounded" style={{ backgroundColor: 'rgb(99, 102, 241)' }}></div>
              <div className="w-4 h-3 rounded" style={{ backgroundColor: 'rgb(59, 130, 246)' }}></div>
            </div>
            <span>High</span>
          </div>
        </div>
      </div>

      {/* Today sparkline */}
      <div className="space-y-2">
        <h3 className="text-sm font-semibold text-slate-200">Today&apos;s Availability</h3>
        <div className="p-3 bg-gray-800/50 border border-gray-700 rounded-lg">
          <svg
            width="280"
            height="60"
            className="w-full"
            role="img"
            aria-label="Today's availability sparkline showing hourly room availability"
          >
            {/* Background grid lines */}
            <g stroke="rgb(55, 65, 81)" strokeWidth="1" opacity="0.3">
              <line x1="0" y1="10" x2="280" y2="10" />
              <line x1="0" y1="30" x2="280" y2="30" />
              <line x1="0" y1="50" x2="280" y2="50" />
            </g>
            
            {/* Sparkline */}
            <path
              d={sparklinePath}
              fill="none"
              stroke="rgb(59, 130, 246)"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            
            {/* Fill area under line */}
            <path
              d={`${sparklinePath} L 280,50 L 0,50 Z`}
              fill="rgb(59, 130, 246)"
              opacity="0.2"
            />
            
            {/* Time markers */}
            <g fontSize="9" fill="rgb(148, 163, 184)" textAnchor="middle">
              <text x="0" y="58">0</text>
              <text x="70" y="58">6</text>
              <text x="140" y="58">12</text>
              <text x="210" y="58">18</text>
              <text x="280" y="58">24</text>
            </g>
          </svg>
        </div>
      </div>
    </div>
  );
}

