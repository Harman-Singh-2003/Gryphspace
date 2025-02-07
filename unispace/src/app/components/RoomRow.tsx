import React from 'react';
import { TimeSlot } from "../utils/room_timetable";

interface RoomRowProps {
    name: string;
    availability: boolean;
    timeSlots: TimeSlot[] | undefined;
    day: string;
}

export const RoomRow: React.FC<RoomRowProps> = ({ name, availability, timeSlots }) => {
    return (
        <div className="flex flex-col bg-gray-800 p-4 mb-2 rounded justify-center">
            <div className="flex justify-start items-center">
                <div className="font-bold pr-2">{name}</div>
                <div>
                    {availability ? (
                        <span className="text-green-500">&#9679;</span>
                    ) : (
                        <span className="text-red-500">&#9679;</span>
                    )}
                </div>
            </div>
            {timeSlots && timeSlots.length > 0 && <div className="mt-2">
                {timeSlots?.map((slot, index) => (
                    <div key={index}>
                        {slot.StartTime} - {slot.EndTime}
                    </div>
                ))}
            </div>}
        </div>
    );
};