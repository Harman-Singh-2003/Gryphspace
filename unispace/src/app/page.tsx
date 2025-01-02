'use client'
import { useEffect, useState } from "react";
import isRoomFree from "@/app/utils/checkAvailability";
import roomTimetableData from "@/app/room_timetable.json";
import BuildingSchedule from "@/app/utils/room_timetable";

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
  const [roomAvailability, setRoomAvailability] = useState<{ [building: string]: { [room: string]: boolean } }>({});

  useEffect(() => {
    const checkAvailability = () => {
      const availability: { [building: string]: { [room: string]: boolean } } = {};
      const shortDay = new Date().toLocaleString('en-US', { weekday: 'short' }); // Get current day in short format (e.g., "Mon", "Tue")
      const day = getDayKey(shortDay); // Map to M, T, W, Th, F
      const time = new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true }); // Get current time in "hh:mm AM/PM" format
      for (const buildingCode in roomTimetable) {
        availability[buildingCode] = {};
        for (const roomNumber in roomTimetable[buildingCode]) {
          availability[buildingCode][roomNumber] = isRoomFree(roomTimetable, buildingCode, roomNumber, day, time);
        }
      }

      setRoomAvailability(availability);
    };

    checkAvailability();
  }, []);

  return (
    <div>
      <h1>Unispace</h1>
      <p>Find the perfect study space for you</p>
      <div>
        {Object.keys(roomAvailability).map((building) => (
          <div key={building}>
            <h2>{building}</h2>
            <ul>
              {Object.keys(roomAvailability[building]).map((room) => (
                <li key={room}>
                  {room} - {roomAvailability[building][room] ? "Available" : "Not Available"}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}