"use client";
import { BuildingSchedule, RoomSchedule } from "@/app/utils/room_timetable";
import { RoomAvailabilitySchema } from "@/app/utils/availabilitySchema";

// prop interface

interface BuildingRowProps {
  name: string;
  availablility: boolean;
  roomSchedule: RoomSchedule;
  roomAvailabilities: RoomAvailabilitySchema;
  day: string;
}

export const BuildingRow: React.FC<BuildingRowProps> = ({
  name,
  roomSchedule,
  roomAvailabilities,
}) => {
  return (
    <div>
      {name}
      {Object.keys(roomSchedule).map((room) => {
        return (
          <div key={room}>
            {room} -{" "}
            {roomAvailabilities?.[room] ? "Available" : "Not Available"}
          </div>
        );
      })}
    </div>
  );
};
