// Enhanced availability calculator that supports custom date/time queries and filters
// Memoizes results for performance
import BuildingSchedule, { TimeSlot } from './room_timetable';
import { AvailabilityQuery } from '../hooks/useAvailabilityState';
import { availabilitySchema } from './availabilitySchema';

// Convert 24-hour HH:MM to 12-hour format for comparison
function to12Hour(time24: string): string {
  const [hours, minutes] = time24.split(':').map(Number);
  const period = hours >= 12 ? 'PM' : 'AM';
  const hour12 = hours === 0 ? 12 : hours > 12 ? hours - 12 : hours;
  return `${String(hour12).padStart(2, '0')}:${String(minutes).padStart(2, '0')} ${period}`;
}

// Parse 12-hour time to minutes since midnight
function timeToMinutes(time12: string): number {
  const [time, period] = time12.split(' ');
  const [hours, minutes] = time.split(':').map(Number);
  let hour24 = hours;
  if (period === 'PM' && hours !== 12) hour24 += 12;
  if (period === 'AM' && hours === 12) hour24 = 0;
  return hour24 * 60 + minutes;
}

// Check if a room is free at a specific time and duration
function isRoomFreeAt(
  schedule: TimeSlot[],
  checkTime: string, // 12-hour format
  durationMinutes: number
): boolean {
  const checkStart = timeToMinutes(checkTime);
  const checkEnd = checkStart + durationMinutes;
  
  // Check if the desired time window overlaps with any occupied slot
  for (const slot of schedule) {
    const slotStart = timeToMinutes(slot.StartTime);
    const slotEnd = timeToMinutes(slot.EndTime);
    
    // If there's any overlap, room is NOT free
    if (checkStart < slotEnd && checkEnd > slotStart) {
      return false;
    }
  }
  
  return true; // No conflicts, room is free
}

// Get day key from date
function getDayKeyFromDate(date: Date): string {
  const dayIndex = date.getDay(); // 0=Sun, 1=Mon, ..., 6=Sat
  if (dayIndex === 0 || dayIndex === 6) return 'Wknd';
  const dayKeys = ['', 'M', 'T', 'W', 'Th', 'F'];
  return dayKeys[dayIndex];
}

// Calculate room availability for a given query
export function calculateAvailability(
  timetable: BuildingSchedule,
  query: AvailabilityQuery
): availabilitySchema {
  const date = new Date(query.date);
  const dayKey = getDayKeyFromDate(date);
  const time12 = to12Hour(query.startTime);
  
  const availability: availabilitySchema = {};
  
  Object.keys(timetable).forEach((buildingCode) => {
    availability[buildingCode] = {};
    const building = timetable[buildingCode];
    
    Object.keys(building).forEach((roomNumber) => {
      const roomSchedule = building[roomNumber];
      const daySchedule = roomSchedule[dayKey] || [];
      
      // Weekend handling (empty schedule = available)
      if (dayKey === 'Wknd') {
        availability[buildingCode][roomNumber] = true;
        return;
      }
      
      // Check if room is free for the requested duration
      availability[buildingCode][roomNumber] = isRoomFreeAt(
        daySchedule,
        time12,
        query.duration
      );
    });
  });
  
  return availability;
}

// Memoization cache for availability calculations
const availabilityCache = new Map<string, availabilitySchema>();

function getCacheKey(query: AvailabilityQuery): string {
  return `${query.date}-${query.startTime}-${query.duration}`;
}

export function calculateAvailabilityCached(
  timetable: BuildingSchedule,
  query: AvailabilityQuery
): availabilitySchema {
  const cacheKey = getCacheKey(query);
  
  if (availabilityCache.has(cacheKey)) {
    return availabilityCache.get(cacheKey)!;
  }
  
  const result = calculateAvailability(timetable, query);
  availabilityCache.set(cacheKey, result);
  
  // Limit cache size to prevent memory issues
  if (availabilityCache.size > 100) {
    const firstKey = availabilityCache.keys().next().value;
    if (firstKey !== undefined) {
      availabilityCache.delete(firstKey);
    }
  }
  
  return result;
}

// Calculate weekly availability for heatmap (Mon-Fri, 8-22 in 1-hour buckets)
export interface WeeklyAvailability {
  [day: string]: number[]; // Array of availability percentages per hour bucket
}

export function calculateWeeklyAvailability(
  timetable: BuildingSchedule,
  buildingFilter?: string
): WeeklyAvailability {
  const days = ['M', 'T', 'W', 'Th', 'F'];
  const hours = Array.from({ length: 14 }, (_, i) => i + 8); // 8-21
  const weekly: WeeklyAvailability = {};
  
  days.forEach((day) => {
    weekly[day] = [];
    
    hours.forEach((hour) => {
      const time12 = to12Hour(`${String(hour).padStart(2, '0')}:00`);
      let totalRooms = 0;
      let freeRooms = 0;
      
      Object.keys(timetable).forEach((buildingCode) => {
        if (buildingFilter && buildingFilter !== buildingCode) return;
        
        const building = timetable[buildingCode];
        Object.keys(building).forEach((roomNumber) => {
          const roomSchedule = building[roomNumber];
          const daySchedule = roomSchedule[day] || [];
          totalRooms++;
          
          if (isRoomFreeAt(daySchedule, time12, 60)) {
            freeRooms++;
          }
        });
      });
      
      const percentage = totalRooms > 0 ? (freeRooms / totalRooms) * 100 : 0;
      weekly[day].push(Math.round(percentage));
    });
  });
  
  return weekly;
}

// Calculate today's availability sparkline (0-23 hours)
export function calculateTodaySparkline(
  timetable: BuildingSchedule,
  date: Date,
  buildingFilter?: string
): number[] {
  const dayKey = getDayKeyFromDate(date);
  if (dayKey === 'Wknd') return Array(24).fill(100); // All free on weekends
  
  const sparkline: number[] = [];
  
  for (let hour = 0; hour < 24; hour++) {
    const time12 = to12Hour(`${String(hour).padStart(2, '0')}:00`);
    let totalRooms = 0;
    let freeRooms = 0;
    
    Object.keys(timetable).forEach((buildingCode) => {
      if (buildingFilter && buildingFilter !== buildingCode) return;
      
      const building = timetable[buildingCode];
      Object.keys(building).forEach((roomNumber) => {
        const roomSchedule = building[roomNumber];
        const daySchedule = roomSchedule[dayKey] || [];
        totalRooms++;
        
        if (isRoomFreeAt(daySchedule, time12, 30)) {
          freeRooms++;
        }
      });
    });
    
    const percentage = totalRooms > 0 ? (freeRooms / totalRooms) * 100 : 0;
    sparkline.push(Math.round(percentage));
  }
  
  return sparkline;
}

