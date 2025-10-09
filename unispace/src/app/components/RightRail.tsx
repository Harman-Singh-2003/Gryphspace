"use client";
// Right rail container combining all filter and visualization components
// Sticky positioning at lg+ breakpoint
import React from 'react';
import { TimeChips } from './TimeChips';
import { TimeControls } from './TimeControls';
import { Legend } from './Legend';
import { MiniAvailability } from './MiniAvailability';
import { AvailabilityQuery, TimeFilter } from '../hooks/useAvailabilityState';
import { WeeklyAvailability } from '../utils/availabilityCalculator';

interface RightRailProps {
  query: AvailabilityQuery;
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onDurationChange: (duration: number) => void;
  onToggleFilter: (filter: TimeFilter) => void;
  onClearFilter: (filter: TimeFilter) => void;
  onClearAllFilters: () => void;
  onSetToNow: () => void;
  onAddMinutes: (minutes: number) => void;
  onSetToTonight: () => void;
  weeklyData: WeeklyAvailability;
  todaySparkline: number[];
}

export function RightRail({
  query,
  onDateChange,
  onStartTimeChange,
  onDurationChange,
  onToggleFilter,
  onClearFilter,
  onClearAllFilters,
  onSetToNow,
  onAddMinutes,
  onSetToTonight,
  weeklyData,
  todaySparkline,
}: RightRailProps) {
  return (
    <aside
      className="
        w-full
        lg:sticky lg:top-4 lg:self-start
        lg:max-h-[calc(100vh-2rem)]
        lg:overflow-y-auto
        scrollbar-thin
        space-y-6 p-4 lg:p-6
        bg-gray-900/50 rounded-lg border border-gray-800
      "
      aria-label="Filters and availability insights"
    >
      {/* Section A: Quick Filter Chips */}
      <section aria-labelledby="filter-chips-heading">
        <h2 id="filter-chips-heading" className="text-lg font-semibold text-slate-200 mb-3">
          Quick Filters
        </h2>
        <TimeChips
          activeFilters={query.activeFilters}
          onToggle={onToggleFilter}
          onClear={onClearFilter}
          onClearAll={onClearAllFilters}
        />
      </section>

      {/* Divider */}
      <hr className="border-gray-700" />

      {/* Section B: Time Controls */}
      <section aria-labelledby="time-controls-heading">
        <h2 id="time-controls-heading" className="text-lg font-semibold text-slate-200 mb-3">
          Time Controls
        </h2>
        <TimeControls
          date={query.date}
          startTime={query.startTime}
          duration={query.duration}
          onDateChange={onDateChange}
          onStartTimeChange={onStartTimeChange}
          onDurationChange={onDurationChange}
          onSetToNow={onSetToNow}
          onAddMinutes={onAddMinutes}
          onSetToTonight={onSetToTonight}
        />
      </section>

      {/* Divider */}
      <hr className="border-gray-700" />

      {/* Section C: Legend */}
      <section aria-labelledby="legend-heading">
        <h2 id="legend-heading" className="sr-only">
          Availability Legend
        </h2>
        <Legend />
      </section>

      {/* Divider */}
      <hr className="border-gray-700" />

      {/* Section D: Visual Summaries */}
      <section aria-labelledby="visual-summaries-heading">
        <h2 id="visual-summaries-heading" className="text-lg font-semibold text-slate-200 mb-3">
          Availability Insights
        </h2>
        <MiniAvailability
          weeklyData={weeklyData}
          todaySparkline={todaySparkline}
        />
      </section>
    </aside>
  );
}

