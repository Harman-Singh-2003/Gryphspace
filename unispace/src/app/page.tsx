"use client";
import { useEffect, useState } from "react";
import isRoomFree from "@/app/utils/checkAvailability";
import roomTimetableData from "@/app/room_timetable.json";
import BuildingSchedule, { RoomSchedule } from "@/app/utils/room_timetable";
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
  return dayMap[shortDay] || "";
};

export default function Home() {
  const [roomAvailability, setRoomAvailability] = useState<{
    [building: string]: { [room: string]: boolean };
  }>({});

  let shortDay = new Date().toLocaleString("en-US", { weekday: "short" }); // Get current day in short format (e.g., "Mon", "Tue")
  let day = getDayKey(shortDay); // Map to M, T, W, Th, F
  let time = new Date().toLocaleTimeString("en-US", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  }); // Get current time in "hh:mm AM/PM" format

  useEffect(() => {
    const checkAvailability = () => {
      const availability: availabilitySchema = {};
      shortDay = new Date().toLocaleString("en-US", { weekday: "short" }); // Get current day in short format (e.g., "Mon", "Tue")
      day = getDayKey(shortDay); // Map to M, T, W, Th, F
      time = new Date().toLocaleTimeString("en-US", {
        hour: "2-digit",
        minute: "2-digit",
        hour12: true,
      }); // Get current time in "hh:mm AM/PM" format

      Object.keys(roomTimetable).map((buildingCode) => {
        availability[buildingCode] = {};
        Object.keys(roomTimetable[buildingCode]).map((roomNumber) => {
          availability[buildingCode][roomNumber] = isRoomFree(
            roomTimetable,
            buildingCode,
            roomNumber,
            day,
            time
          );
        });
      });

      setRoomAvailability(availability);
    };

    checkAvailability();
  }, []);

  return (
    <div>
      <h1>Unispace</h1>
      <p>Find the perfect study space for you</p>
      <div>
        {Object.keys(roomTimetable).map((building: string) => {
          return (
            <BuildingRow
              key={building}
              name={building}
              availablility={true}
              day={day}
              roomSchedule={roomTimetable[building]}
              roomAvailabilities={roomAvailability[building]}
            />
          );
        })}
      </div>
    </div>
  );
}
