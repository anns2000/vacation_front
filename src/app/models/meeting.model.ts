export interface Participant {
  id: number;
  username: string;
}

export interface Meeting {
  id: number;
  startTime: Date;
  endTime: Date;
  location: string;
  participants: Participant[];
}