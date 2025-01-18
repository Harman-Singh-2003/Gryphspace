import React from 'react';
import {  TimeSlot } from "../utils/room_timetable";

interface RoomRowProps {
    name: string;
    availability: boolean;
    timeSlots: TimeSlot[] | undefined;
    day: string;
}

export const RoomRow: React.FC<RoomRowProps> = ({ name, availability, timeSlots }) => {
    return (
        <div className="bg-gray-200 p-4 mb-2 rounded">
            <div className="flex justify-between items-center">
                <div className="font-bold">{name}</div>
                <div>{availability ? "Available" : "Not Available"}</div>
            </div>
            <div className="mt-2">
                {timeSlots?.map((slot, index) => (
                    <div key={index}>
                        {slot.StartTime} - {slot.EndTime}
                    </div>
                ))}
            </div>
        </div>
    );
};