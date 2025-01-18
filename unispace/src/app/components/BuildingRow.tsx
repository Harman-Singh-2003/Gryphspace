"use client";
import React from "react";
import { useState } from "react";
import { RoomSchedule } from "@/app/utils/room_timetable";
import { RoomAvailabilitySchema } from "@/app/utils/availabilitySchema";
import { RoomRow } from "@/app/components/RoomRow";

interface BuildingRowProps {
  name: string;
  availablility: boolean;
  roomSchedule: RoomSchedule;
  roomAvailabilities: RoomAvailabilitySchema;
  day: string;
}

export const BuildingRow: React.FC<BuildingRowProps> = ({
  name,
  availablility,
  roomSchedule,
  roomAvailabilities,
  day,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="flex flex-col bg-indigo-800 p-4">
      <button
        className="bg-red-400 flex flex-row px-4 justify-between"
        onClick={() => {
          setIsOpen(!isOpen);
        }}
      >
        <div className="flex flex-row">
          <div className="bg-green-300">IMAGE</div>
          <div className="flex flex-col bg-orange-500">
            <div>{name}</div>
            <div>{availablility ? "Available" : "Not Available"}</div>
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
