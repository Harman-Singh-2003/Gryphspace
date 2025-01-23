export interface TimeSlot {
    StartTime: string;
    EndTime: string;
}

export interface DaySchedule {
    M: TimeSlot[];
    T: TimeSlot[];
    W: TimeSlot[];
    Th: TimeSlot[];
    F: TimeSlot[];
    [key: string]: TimeSlot[] | undefined;
}

export interface RoomSchedule {
    [roomNumber: string]: DaySchedule;
}

export interface BuildingSchedule {
    [buildingCode: string]: RoomSchedule;
}

export default BuildingSchedule;