interface TimeSlot {
    StartTime: string;
    EndTime: string;
}

interface DaySchedule {
    M: TimeSlot[];
    T: TimeSlot[];
    W: TimeSlot[];
    Th: TimeSlot[];
    F: TimeSlot[];
    [key: string]: TimeSlot[] | undefined;
}

interface RoomSchedule {
    [roomNumber: string]: DaySchedule;
}

interface BuildingSchedule {
    [buildingCode: string]: RoomSchedule;
}

export default BuildingSchedule;