import { BuildingSchedule, isRoomFree } from '@/app/utils';

// Example usage:
const roomTimetable: BuildingSchedule = {
    "ROZH": {
        "104": {
            "M": [],
            "T": [],
            "W": [
                {
                    "StartTime": "06:50 PM",
                    "EndTime": "09:50 PM"
                }
            ],
            "Th": [
                {
                    "StartTime": "08:50 PM",
                    "EndTime": "09:50 PM"
                }
            ],
            "F": [
                {
                    "StartTime": "04:20 PM",
                    "EndTime": "09:50 PM"
                }
            ]
        },
        "101": {
            "M": [
                {
                    "StartTime": "08:50 PM",
                    "EndTime": "09:50 PM"
                }
            ],
            "T": [
                {
                    "StartTime": "08:50 PM",
                    "EndTime": "09:50 PM"
                }
            ],
            "W": [
                {
                    "StartTime": "05:20 PM",
                    "EndTime": "07:00 PM"
                }
            ],
            "Th": [],
            "F": []
        }
    }
};

const buildingCode = "ROZH";
const roomNumber = "101";
const day = "W";
const time = "06:00 PM";

const isFree = isRoomFree(roomTimetable, buildingCode, roomNumber, day, time);
console.log(`Is room ${roomNumber} in building ${buildingCode} free on ${day} at ${time}? ${isFree}`);