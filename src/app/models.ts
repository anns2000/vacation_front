// src/app/models.ts
export interface Participant {
  id: string;
  username: string;
  email: string;
}

export interface Meeting {
  id: string;
  startTime: string;
  endTime: string;
  location: string;
  participants: Participant[];
}