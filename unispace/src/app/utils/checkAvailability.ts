import BuildingSchedule from './room_timetable';

function isTimeInRange(startTime: string, endTime: string, checkTime: string): boolean {
    const [startHour, startMinute, startPeriod] = startTime.split(/[: ]/);
    const [endHour, endMinute, endPeriod] = endTime.split(/[: ]/);
    const [checkHour, checkMinute, checkPeriod] = checkTime.split(/[: ]/);

    const convertTo24Hour = (hour: string, period: string): number => {
        let hour24 = parseInt(hour, 10);
        if (period === 'PM' && hour24 !== 12) {
            hour24 += 12;
        } else if (period === 'AM' && hour24 === 12) {
            hour24 = 0;
        }
        return hour24;
    };

    const start = new Date(2000, 0, 1, convertTo24Hour(startHour, startPeriod), parseInt(startMinute, 10));
    const end = new Date(2000, 0, 1, convertTo24Hour(endHour, endPeriod), parseInt(endMinute, 10));
    const check = new Date(2000, 0, 1, convertTo24Hour(checkHour, checkPeriod), parseInt(checkMinute, 10));

    return check >= start && check <= end;
}

function isRoomFree(buildingSchedule: BuildingSchedule, buildingCode: string, roomNumber: string, day: string, time: string): boolean {
    const building = buildingSchedule[buildingCode];
    if (!building) {
        throw new Error(`Building code ${buildingCode} not found`);
    }

    const roomSchedule = building[roomNumber];
    if (!roomSchedule) {
        throw new Error(`Room number ${roomNumber} not found in building ${buildingCode}`);
    }

    const daySchedule = roomSchedule[day];
    if (!daySchedule) {
        throw new Error(`Day ${day} not found in room ${roomNumber} schedule in building ${buildingCode}`);
    }
    
    for (const timeSlot of daySchedule) {
        if (isTimeInRange(timeSlot.StartTime, timeSlot.EndTime, time)) {
            return true; // An empty time slot was found
        }
    }

    return false; // Room is not available
}

export default isRoomFree;