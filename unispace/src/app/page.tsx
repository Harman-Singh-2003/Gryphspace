"use client";
import isRoomFree from "@/app/utils/checkAvailability";
import roomTimetableData from "@/app/room_timetable.json";
import BuildingSchedule from "@/app/utils/room_timetable";
import { availabilitySchema } from "@/app/utils/availabilitySchema";
import { BuildingRow } from "@/app/components/BuildingRow";

const roomTimetable = roomTimetableData as BuildingSchedule;

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

const calculateRoomAvailability = (roomTimetable: BuildingSchedule, day: string, time: string): availabilitySchema => {
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
  const shortDay = new Date().toLocaleString("en-US", { weekday: "short" }); // Get current day in short format (e.g., "Mon", "Tue")
  const day = getDayKey(shortDay); // Map to M, T, W, Th, F
  const time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }); // Get current time in "hh:mm AM/PM" format

  const roomAvailability = calculateRoomAvailability(roomTimetable, day, time);

  return (
    <div className="mx-auto min-h-screen p-4 lg:p-8 bg-gray-950 text-slate-50 flex flex-col items-center">
      <h1 className="font-bold text-4xl p-4">GryphSpace</h1>
      <div className="flex flex-col bg-gray-950 items-center w-full md:max-w-screen-lg ">
        <div className="flex flex-row justify-center w-full md:max-w-screen-lg">
          <div className="flex flex-col  items-center p-2 bg-gray-900 rounded-lg">
            {Object.keys(roomTimetable).map((building: string, index: number) => {
              const buildingAvailability = roomAvailability[building] || {};
              return (
                <div
                  className={`flex bg-gray-950 flex-col min-w-96 md:w-1/2 max-w-lg ${index !== 0 ? 'border-t border-gray-500' : ''}`}
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
            })}
          </div>
        </div>
      </div>
    </div>
  );
}