"use client";
// Hook for managing availability query state (date, time, duration, filters)
// Syncs state with URL query params for shareable links
import { useEffect, useState, useCallback } from 'react';

export type TimeFilter = 'open-now' | 'free-30' | 'free-60' | 'morning' | 'afternoon' | 'evening' | 'today';

export interface AvailabilityQuery {
  date: string; // YYYY-MM-DD format
  startTime: string; // HH:MM 24-hour format
  duration: number; // minutes
  activeFilters: Set<TimeFilter>;
}

// Helper to parse URL search params into state
function parseQueryParams(searchParams: URLSearchParams): Partial<AvailabilityQuery> {
  const query: Partial<AvailabilityQuery> = {};
  
  if (searchParams.has('date')) {
    query.date = searchParams.get('date')!;
  }
  
  if (searchParams.has('start')) {
    query.startTime = searchParams.get('start')!;
  }
  
  if (searchParams.has('duration')) {
    query.duration = parseInt(searchParams.get('duration')!, 10);
  }
  
  if (searchParams.has('filters')) {
    const filters = searchParams.get('filters')!.split(',') as TimeFilter[];
    query.activeFilters = new Set(filters);
  }
  
  return query;
}

// Helper to serialize state into URL search params
function serializeQueryParams(query: AvailabilityQuery): URLSearchParams {
  const params = new URLSearchParams();
  params.set('date', query.date);
  params.set('start', query.startTime);
  params.set('duration', query.duration.toString());
  if (query.activeFilters.size > 0) {
    params.set('filters', Array.from(query.activeFilters).join(','));
  }
  return params;
}

export function useAvailabilityState() {
  // Initialize with current date/time
  const now = new Date();
  const [query, setQuery] = useState<AvailabilityQuery>(() => {
    // Try to parse from URL on initial load
    if (typeof window !== 'undefined') {
      const urlParams = new URLSearchParams(window.location.search);
      const parsed = parseQueryParams(urlParams);
      
      return {
        date: parsed.date || now.toISOString().split('T')[0],
        startTime: parsed.startTime || `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
        duration: parsed.duration || 30,
        activeFilters: parsed.activeFilters || new Set<TimeFilter>(),
      };
    }
    
    return {
      date: now.toISOString().split('T')[0],
      startTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
      duration: 30,
      activeFilters: new Set<TimeFilter>(),
    };
  });

  // Sync state to URL (debounced via useEffect)
  useEffect(() => {
    if (typeof window === 'undefined') return;
    
    const params = serializeQueryParams(query);
    const newUrl = `${window.location.pathname}?${params.toString()}`;
    
    // Update URL without triggering navigation
    window.history.replaceState({}, '', newUrl);
  }, [query]);

  // Update date
  const setDate = useCallback((date: string) => {
    setQuery(prev => ({ ...prev, date }));
  }, []);

  // Update start time
  const setStartTime = useCallback((startTime: string) => {
    setQuery(prev => ({ ...prev, startTime }));
  }, []);

  // Update duration
  const setDuration = useCallback((duration: number) => {
    setQuery(prev => ({ ...prev, duration }));
  }, []);

  // Toggle a filter chip
  const toggleFilter = useCallback((filter: TimeFilter) => {
    setQuery(prev => {
      const newFilters = new Set(prev.activeFilters);
      if (newFilters.has(filter)) {
        newFilters.delete(filter);
      } else {
        newFilters.add(filter);
      }
      return { ...prev, activeFilters: newFilters };
    });
  }, []);

  // Clear a specific filter
  const clearFilter = useCallback((filter: TimeFilter) => {
    setQuery(prev => {
      const newFilters = new Set(prev.activeFilters);
      newFilters.delete(filter);
      return { ...prev, activeFilters: newFilters };
    });
  }, []);

  // Clear all filters
  const clearAllFilters = useCallback(() => {
    setQuery(prev => ({ ...prev, activeFilters: new Set<TimeFilter>() }));
  }, []);

  // Preset: Set to current time
  const setToNow = useCallback(() => {
    const now = new Date();
    setQuery(prev => ({
      ...prev,
      date: now.toISOString().split('T')[0],
      startTime: `${String(now.getHours()).padStart(2, '0')}:${String(now.getMinutes()).padStart(2, '0')}`,
    }));
  }, []);

  // Preset: Add minutes to current time
  const addMinutes = useCallback((minutes: number) => {
    setQuery(prev => {
      const [hours, mins] = prev.startTime.split(':').map(Number);
      const date = new Date(prev.date);
      date.setHours(hours, mins + minutes);
      
      return {
        ...prev,
        date: date.toISOString().split('T')[0],
        startTime: `${String(date.getHours()).padStart(2, '0')}:${String(date.getMinutes()).padStart(2, '0')}`,
      };
    });
  }, []);

  // Preset: Set to tonight (6 PM)
  const setToTonight = useCallback(() => {
    setQuery(prev => ({
      ...prev,
      startTime: '18:00',
    }));
  }, []);

  return {
    query,
    setDate,
    setStartTime,
    setDuration,
    toggleFilter,
    clearFilter,
    clearAllFilters,
    setToNow,
    addMinutes,
    setToTonight,
  };
}

