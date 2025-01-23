"use client";
import React from "react";
import { useState } from "react";
import { RoomSchedule } from "@/app/utils/room_timetable";
import { RoomAvailabilitySchema } from "@/app/utils/availabilitySchema";
import { RoomRow } from "@/app/components/RoomRow";

interface BuildingRowProps {
  name: string;
  availability: boolean;
  roomSchedule: RoomSchedule;
  roomAvailabilities: RoomAvailabilitySchema;
  day: string;
}

export const BuildingRow: React.FC<BuildingRowProps> = ({
  name,
  availability,
  roomSchedule,
  roomAvailabilities,
  day,
}) => {
  const [isOpen, setIsOpen] = useState(false);
  console.log(name);
  console.log(availability);
  return (
    <div className="flex flex-col bg-gray-900 p-2">
      <button
        className="bg-gray-900 flex flex-row justify-between items-center"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex flex-row bg-gray-900">
          {/* <div className="bg-green-300">IMAGE</div> */}
          <div className="flex flex-row bg-gray-900 items-center">
            <div className="font-semibold text-xl m-2">{name}</div>
            <div>
              {availability ? (
                <span className="text-green-500">&#9679;</span>
              ) : (
                <span className="text-red-500">&#9679;</span>
              )}
            </div>
          </div>
        </div>
        <div>
          <div className="bg-gray-900 flex items-center justify-between">

            {isOpen ? (
              <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 15l7-7 7 7"></path>
              </svg>
            ) : (
              <svg className="w-4 h-4 text-slate-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path>
              </svg>
            )}
            <span className="mx-2 text-slate-300">View Rooms</span>
          </div>
        </div>
      </button>
      {isOpen && <div>
        {Object.keys(roomSchedule).map((room) => (
          <RoomRow
            key={room}
            name={room}
            availability={roomAvailabilities?.[room]}
            timeSlots={roomSchedule?.[room]?.[day]}
            day={day}
          />
        ))}
      </div>}
    </div>
  );
};
