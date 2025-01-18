export interface availabilitySchema {
    [building: string]: RoomAvailabilitySchema;
  }
  
export interface RoomAvailabilitySchema {
    [room: string]: boolean;
}