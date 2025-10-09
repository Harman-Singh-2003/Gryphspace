"use client";
// Time-focused filter chips component
// Multi-select chips with keyboard support and ARIA attributes
import React from 'react';
import { TimeFilter } from '../hooks/useAvailabilityState';

interface TimeChipsProps {
  activeFilters: Set<TimeFilter>;
  onToggle: (filter: TimeFilter) => void;
  onClear: (filter: TimeFilter) => void;
  onClearAll: () => void;
}

const FILTER_LABELS: Record<TimeFilter, string> = {
  'open-now': 'Open now',
  'free-30': 'Free ≥ 30 min',
  'free-60': 'Free ≥ 60 min',
  'morning': 'Morning (8–12)',
  'afternoon': 'Afternoon (12–5)',
  'evening': 'Evening (after 6)',
  'today': 'Available today',
};

const FILTER_ORDER: TimeFilter[] = [
  'open-now',
  'free-30',
  'free-60',
  'morning',
  'afternoon',
  'evening',
  'today',
];

export function TimeChips({ activeFilters, onToggle, onClear, onClearAll }: TimeChipsProps) {
  return (
    <div className="space-y-3">
      {/* Chip group */}
      <div 
        className="flex flex-wrap gap-2"
        role="group"
        aria-label="Time filters"
      >
        {FILTER_ORDER.map((filter) => {
          const isActive = activeFilters.has(filter);
          return (
            <button
              key={filter}
              onClick={() => onToggle(filter)}
              onKeyDown={(e) => {
                // Support Space and Enter for toggling
                if (e.key === ' ' || e.key === 'Enter') {
                  e.preventDefault();
                  onToggle(filter);
                }
              }}
              aria-pressed={isActive}
              className={`
                px-3 py-1.5 rounded-full text-sm font-medium
                transition-colors duration-200
                focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-950
                ${
                  isActive
                    ? 'bg-blue-600 text-white hover:bg-blue-700'
                    : 'bg-gray-800 text-slate-300 hover:bg-gray-700 border border-gray-700'
                }
              `}
            >
              {FILTER_LABELS[filter]}
            </button>
          );
        })}
      </div>

      {/* Active filters with clear buttons */}
      {activeFilters.size > 0 && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <span className="text-sm text-slate-400">Active filters:</span>
            <button
              onClick={onClearAll}
              className="text-xs text-blue-400 hover:text-blue-300 underline focus:outline-none focus:ring-2 focus:ring-blue-500 rounded"
              aria-label="Clear all filters"
            >
              Clear all
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {Array.from(activeFilters).map((filter) => (
              <span
                key={filter}
                className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-blue-900/40 text-blue-200 text-xs rounded-full border border-blue-700/50"
              >
                {FILTER_LABELS[filter]}
                <button
                  onClick={() => onClear(filter)}
                  className="hover:text-white focus:outline-none focus:ring-1 focus:ring-blue-400 rounded"
                  aria-label={`Remove ${FILTER_LABELS[filter]} filter`}
                >
                  <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </span>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

