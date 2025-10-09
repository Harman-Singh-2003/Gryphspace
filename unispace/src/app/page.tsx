"use client";
// Main page with 2-column layout: room list + right rail (desktop)
// Mobile: filters in drawer
import isRoomFree from "@/app/utils/checkAvailability";
import roomTimetableData from "@/app/room_timetable.json";
import BuildingSchedule from "@/app/utils/room_timetable";
import { availabilitySchema } from "@/app/utils/availabilitySchema";
import { BuildingRow } from "@/app/components/BuildingRow";
import { RightRail } from "@/app/components/RightRail";
import { MobileFiltersDrawer } from "@/app/components/MobileFiltersDrawer";
import { useAvailabilityState } from "@/app/hooks/useAvailabilityState";
import { 
  calculateAvailabilityCached, 
  calculateWeeklyAvailability, 
  calculateTodaySparkline 
} from "@/app/utils/availabilityCalculator";
import { useEffect, useState, useMemo } from "react";

const roomTimetable = roomTimetableData as BuildingSchedule;

// Helper to get day key from shortDay string (Mon, Tue, etc.)
const getDayKey = (shortDay: string): string => {
  const dayMap: { [key: string]: string } = {
    Mon: "M",
    Tue: "T",
    Wed: "W",
    Thu: "Th",
    Fri: "F",
  };
  return dayMap[shortDay] || "Wknd";
};

// Helper to get day key from a Date object
const getDayKeyFromDate = (date: Date): string => {
  const dayIndex = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  if (dayIndex === 0 || dayIndex === 6) return 'Wknd';
  const dayKeys = ['', 'M', 'T', 'W', 'Th', 'F'];
  return dayKeys[dayIndex];
};

const calculateRoomAvailability = (
  roomTimetable: BuildingSchedule,
  day: string,
  time: string
): availabilitySchema => {
  const availability: availabilitySchema = {};

  Object.keys(roomTimetable).forEach((buildingCode) => {
    availability[buildingCode] = {};
    Object.keys(roomTimetable[buildingCode]).forEach((roomNumber) => {
      availability[buildingCode][roomNumber] = isRoomFree(
        roomTimetable,
        buildingCode,
        roomNumber,
        day,
        time
      );
    });
  });

  return availability;
};

export default function Home() {
  // State management for availability query (date, time, duration, filters)
  // Syncs with URL for shareable links
  const availabilityState = useAvailabilityState();
  
  // Mobile drawer state
  const [isDrawerOpen, setIsDrawerOpen] = useState<boolean>(false);
  
  const [isLoading, setIsLoading] = useState<boolean>(true);

  // Calculate room availability based on query state
  // Uses new calculator with memoization for performance
  const roomAvailability = useMemo(() => {
    if (isLoading) return {};
    return calculateAvailabilityCached(roomTimetable, availabilityState.query);
  }, [availabilityState.query, isLoading]);

  // Get day key for current query
  const day = useMemo(() => {
    const date = new Date(availabilityState.query.date);
    return getDayKeyFromDate(date);
  }, [availabilityState.query.date]);

  // Calculate weekly heatmap data (memoized)
  const weeklyData = useMemo(() => {
    return calculateWeeklyAvailability(roomTimetable);
  }, []); // Static data, only calculate once

  // Calculate today's sparkline (memoized, updates when date changes)
  const todaySparkline = useMemo(() => {
    const date = new Date(availabilityState.query.date);
    return calculateTodaySparkline(roomTimetable, date);
  }, [availabilityState.query.date]);

  // Initial load
  useEffect(() => {
    setIsLoading(false);
  }, []); 

  if (isLoading) {
    return (
      <div className="flex justify-center items-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 bg-gray-950 border-gray-50"></div>
      </div>
    );
  }

  return (
    <div className="mx-auto min-h-screen p-4 lg:p-8 bg-gray-950 text-slate-50">
      {/* Header with mobile filters button */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="font-bold text-4xl">GryphSpace</h1>
        
        {/* Mobile filters button - only visible on < lg */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="lg:hidden px-4 py-2 bg-gray-800 hover:bg-gray-700 text-slate-300 rounded-lg border border-gray-700 focus:outline-none focus:ring-2 focus:ring-blue-500 transition-colors flex items-center gap-2"
          aria-label="Open filters"
        >
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 6V4m0 2a2 2 0 100 4m0-4a2 2 0 110 4m-6 8a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4m6 6v10m6-2a2 2 0 100-4m0 4a2 2 0 110-4m0 4v2m0-6V4" />
          </svg>
          Filters
        </button>
      </div>

      {/* 2-column layout: main list + right rail (desktop) */}
      {/* Center the entire layout with flexbox for proper centering */}
      <div className="flex flex-col lg:flex-row gap-6 lg:justify-center lg:items-start max-w-[1600px] mx-auto">
        {/* Main content: room list - constrained width for better readability */}
        <main className="flex-shrink-0 w-full lg:w-[672px]">
          <div className="flex flex-col bg-gray-900 rounded-lg p-2">
            {Object.keys(roomTimetable).map(
              (building: string, index: number) => {
                const buildingAvailability = roomAvailability[building] || {};
                return (
                  <div
                    className={`flex bg-gray-950 flex-col w-full ${
                      index !== 0 ? "border-t border-gray-500" : ""
                    }`}
                    key={building}
                  >
                    <BuildingRow
                      name={building}
                      availability={Object.values(buildingAvailability).some(
                        (isAvailable) => isAvailable
                      )}
                      day={day}
                      roomSchedule={roomTimetable[building]}
                      roomAvailabilities={buildingAvailability}
                    />
                  </div>
                );
              }
            )}
          </div>
        </main>

        {/* Right rail - hidden on mobile, sticky on desktop */}
        <div className="hidden lg:block flex-shrink-0 lg:w-96">
          <RightRail
            query={availabilityState.query}
            onDateChange={availabilityState.setDate}
            onStartTimeChange={availabilityState.setStartTime}
            onDurationChange={availabilityState.setDuration}
            onToggleFilter={availabilityState.toggleFilter}
            onClearFilter={availabilityState.clearFilter}
            onClearAllFilters={availabilityState.clearAllFilters}
            onSetToNow={availabilityState.setToNow}
            onAddMinutes={availabilityState.addMinutes}
            onSetToTonight={availabilityState.setToTonight}
            weeklyData={weeklyData}
            todaySparkline={todaySparkline}
          />
        </div>
      </div>

      {/* Mobile drawer - only visible on < lg */}
      <MobileFiltersDrawer isOpen={isDrawerOpen} onClose={() => setIsDrawerOpen(false)}>
        <RightRail
          query={availabilityState.query}
          onDateChange={availabilityState.setDate}
          onStartTimeChange={availabilityState.setStartTime}
          onDurationChange={availabilityState.setDuration}
          onToggleFilter={availabilityState.toggleFilter}
          onClearFilter={availabilityState.clearFilter}
          onClearAllFilters={availabilityState.clearAllFilters}
          onSetToNow={availabilityState.setToNow}
          onAddMinutes={availabilityState.addMinutes}
          onSetToTonight={availabilityState.setToTonight}
          weeklyData={weeklyData}
          todaySparkline={todaySparkline}
        />
      </MobileFiltersDrawer>
    </div>
  );
}
