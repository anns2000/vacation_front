import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Meeting } from '../models/meeting.model';

@Injectable({
  providedIn: 'root'
})
export class MeetingService {
  private apiUrl = 'http://localhost:5146/api';

  constructor(private http: HttpClient) {}

  getMeetings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/meeting`);
  }

  updateMeeting(meeting: Meeting): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/meeting/${meeting.id}`, meeting);
  }
}