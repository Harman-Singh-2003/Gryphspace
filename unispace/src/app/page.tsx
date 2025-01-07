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

const getCurrentTime = (): string => {
  const now = new Date();
  return now.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit', hour12: true });
};

export default function Home() {
  const [roomAvailability, setRoomAvailability] = useState<{ [building: string]: { [room: string]: boolean } }>({});
  const [selectedDay, setSelectedDay] = useState<string>(new Date().toLocaleString('en-US', { weekday: 'short' }));
  const [selectedHour, setSelectedHour] = useState<string>(new Date().toLocaleString('en-US', { hour: '2-digit', hour12: true }).split(' ')[0]);
  const [selectedMinute, setSelectedMinute] = useState<string>(new Date().toLocaleString('en-US', { minute: '2-digit' }));
  const [selectedPeriod, setSelectedPeriod] = useState<string>(new Date().toLocaleString('en-US', { hour: '2-digit', hour12: true }).split(' ')[1]);

  const checkAvailability = () => {
    const availability: { [building: string]: { [room: string]: boolean } } = {};
    const day = getDayKey(selectedDay); // Map to M, T, W, Th, F
    const time = `${selectedHour}:${selectedMinute} ${selectedPeriod}`; // Combine selected values to form time string

    for (const buildingCode in roomTimetable) {
      availability[buildingCode] = {};
      for (const roomNumber in roomTimetable[buildingCode]) {
        availability[buildingCode][roomNumber] = isRoomFree(roomTimetable, buildingCode, roomNumber, day, time);
      }
    }

    setRoomAvailability(availability);
  };

  useEffect(() => {
    checkAvailability();
  }, [selectedDay, selectedHour, selectedMinute, selectedPeriod]);

  return (
    <div className="p-4">
      <h1 className="text-2xl font-bold mb-4">Unispace</h1>
      <p className="mb-4">Find the perfect study space for you</p>
      <div className="mb-4">
        <label className="block mb-2">
          Select Day:
          <select
            value={selectedDay}
            onChange={(e) => setSelectedDay(e.target.value)}
            className="block w-auto max-w-xs mt-1 p-2 bg-black text-white rounded"
          >
            <option value="Mon">Monday</option>
            <option value="Tue">Tuesday</option>
            <option value="Wed">Wednesday</option>
            <option value="Thu">Thursday</option>
            <option value="Fri">Friday</option>
          </select>
        </label>
        <label className="block mb-2">
          Select Time:
          <div className="flex space-x-2">
            <select
              value={selectedHour}
              onChange={(e) => setSelectedHour(e.target.value)}
              className="block w-auto max-w-xs mt-1 p-2 bg-slate-700 text-white rounded"
            >
              {Array.from({ length: 12 }, (_, i) => i + 1).map(hour => (
                <option key={hour} value={hour.toString().padStart(2, '0')}>{hour}</option>
              ))}
            </select>
            <select
              value={selectedMinute}
              onChange={(e) => setSelectedMinute(e.target.value)}
              className="block w-auto max-w-xs mt-1 p-2 bg-slate-700 text-white rounded"
            >
              {Array.from({ length: 60 }, (_, i) => i).map(minute => (
                <option key={minute} value={minute.toString().padStart(2, '0')}>{minute.toString().padStart(2, '0')}</option>
              ))}
            </select>
            <select
              value={selectedPeriod}
              onChange={(e) => setSelectedPeriod(e.target.value)}
              className="block w-auto max-w-xs mt-1 p-2 bg-slate-700 text-white rounded"
            >
              <option value="AM">AM</option>
              <option value="PM">PM</option>
            </select>
          </div>
        </label>
        <button
          onClick={checkAvailability}
          className="mt-4 p-2 bg-blue-500 text-white rounded hover:bg-blue-700 w-auto max-w-xs"
        >
          Check Availability
        </button>
      </div>
      <div>
        {Object.keys(roomAvailability).map((building) => (
          <div key={building} className="mb-4">
            <h2 className="text-xl font-semibold">{building}</h2>
            <ul className="list-disc pl-5">
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