"use client";
// Status legend component showing color-coded availability states
import React from 'react';

export function Legend() {
  return (
    <div className="p-4 bg-gray-800/50 border border-gray-700 rounded-lg space-y-3">
      <h3 className="text-sm font-semibold text-slate-200">Legend</h3>
      
      <div className="space-y-2">
        {/* Free */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-green-500" aria-hidden="true"></span>
          <span className="text-sm text-slate-300">Free in selected window</span>
        </div>
        
        {/* Free soon (optional - for future enhancement) */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-yellow-500" aria-hidden="true"></span>
          <span className="text-sm text-slate-300">Free soon (next 30min)</span>
        </div>
        
        {/* Busy */}
        <div className="flex items-center gap-2">
          <span className="w-3 h-3 rounded-full bg-red-500" aria-hidden="true"></span>
          <span className="text-sm text-slate-300">Busy</span>
        </div>
      </div>
      
      <p className="text-xs text-slate-500 mt-2">
        Legend based on selected date/time window.
      </p>
    </div>
  );
}

