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

  return (
    <div className="flex flex-col bg-indigo-800 p-4">
      <button
        className="bg-red-400 flex flex-row justify-between items-center"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex flex-row bg-cyan-300">
          {/* <div className="bg-green-300">IMAGE</div> */}
          <div className="flex flex-row bg-orange-500 items-center">
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
        <div className="bg-purple-400">
          Nothing
          <div className="bg-yellow-300">View Rooms</div>
        </div>
      </button>
      {isOpen && <div className="bg-purple-400">
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
