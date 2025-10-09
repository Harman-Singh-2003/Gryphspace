"use client";
// Time control inputs: presets, date picker, time picker, duration select
// All inputs debounced and accessible
import React, { useState, useEffect } from 'react';

interface TimeControlsProps {
  date: string;
  startTime: string;
  duration: number;
  onDateChange: (date: string) => void;
  onStartTimeChange: (time: string) => void;
  onDurationChange: (duration: number) => void;
  onSetToNow: () => void;
  onAddMinutes: (minutes: number) => void;
  onSetToTonight: () => void;
}

export function TimeControls({
  date,
  startTime,
  duration,
  onDateChange,
  onStartTimeChange,
  onDurationChange,
  onSetToNow,
  onAddMinutes,
  onSetToTonight,
}: TimeControlsProps) {
  // Local state for debouncing
  const [localDate, setLocalDate] = useState(date);
  const [localTime, setLocalTime] = useState(startTime);

  // Debounce date changes (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localDate !== date) {
        onDateChange(localDate);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [localDate, date, onDateChange]);

  // Debounce time changes (250ms)
  useEffect(() => {
    const timer = setTimeout(() => {
      if (localTime !== startTime) {
        onStartTimeChange(localTime);
      }
    }, 250);
    return () => clearTimeout(timer);
  }, [localTime, startTime, onStartTimeChange]);

  // Sync props to local state when changed externally
  useEffect(() => {
    setLocalDate(date);
  }, [date]);

  useEffect(() => {
    setLocalTime(startTime);
  }, [startTime]);

  return (
    <div className="space-y-4">
      {/* Preset buttons */}
      <div className="space-y-2">
        <label className="block text-sm font-medium text-slate-300">Quick actions</label>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onSetToNow}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-slate-300 text-sm rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Now
          </button>
          <button
            onClick={() => onAddMinutes(30)}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-slate-300 text-sm rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            +30m
          </button>
          <button
            onClick={() => onAddMinutes(60)}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-slate-300 text-sm rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            +60m
          </button>
          <button
            onClick={onSetToTonight}
            className="px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-slate-300 text-sm rounded border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors"
          >
            Tonight
          </button>
        </div>
      </div>

      {/* Date picker */}
      <div className="space-y-2">
        <label htmlFor="date-input" className="block text-sm font-medium text-slate-300">
          Date
        </label>
        <input
          id="date-input"
          type="date"
          value={localDate}
          onChange={(e) => setLocalDate(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 text-slate-200 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Time picker */}
      <div className="space-y-2">
        <label htmlFor="time-input" className="block text-sm font-medium text-slate-300">
          Start time
        </label>
        <input
          id="time-input"
          type="time"
          value={localTime}
          onChange={(e) => setLocalTime(e.target.value)}
          className="w-full px-3 py-2 bg-gray-800 text-slate-200 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        />
      </div>

      {/* Duration select */}
      <div className="space-y-2">
        <label htmlFor="duration-select" className="block text-sm font-medium text-slate-300">
          Duration
        </label>
        <select
          id="duration-select"
          value={duration}
          onChange={(e) => onDurationChange(Number(e.target.value))}
          className="w-full px-3 py-2 bg-gray-800 text-slate-200 border border-gray-700 rounded focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
        >
          <option value={15}>15 minutes</option>
          <option value={30}>30 minutes</option>
          <option value={60}>1 hour</option>
          <option value={120}>2 hours</option>
        </select>
      </div>
    </div>
  );
}

