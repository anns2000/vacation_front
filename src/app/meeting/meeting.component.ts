import { Component, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { EditMeetingComponent } from './edit-meeting/edit-meeting.component';

interface Participant {
  username: string;
  email: string;
}

interface Meeting {
  id: string; // Add this line
  startTime: string;
  endTime: string;
  location: string;
  participants: Participant[];
}

@Component({
  selector: 'app-meeting',
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule, EditMeetingComponent]
})
export class MeetingComponent implements OnInit {
  meetings: Meeting[] = [];
  selectedMeeting: Meeting | null = null;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.get<{ success: boolean, message: string, data: Meeting[] }>('http://localhost:5146/api/meeting', { headers })
      .subscribe(response => {
        if (response.success) {
          this.meetings = response.data;
        } else {
          console.error('Failed to fetch meetings:', response.message);
        }
      }, error => {
        console.error('Error fetching meetings:', error);
      });
  }

  editMeeting(meeting: Meeting): void {
    this.selectedMeeting = { ...meeting };
  }

  closeModal(): void {
    this.selectedMeeting = null;
  }

  updateMeeting(updatedMeeting: Meeting): void {
    const token = localStorage.getItem('token');
    const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

    this.http.put<{ success: boolean, message: string, data: Meeting }>(`http://localhost:5146/api/meeting/${updatedMeeting.id}`, updatedMeeting, { headers })
      .subscribe(response => {
        if (response.success) {
          const index = this.meetings.findIndex(m => m.id === updatedMeeting.id);
          if (index !== -1) {
            this.meetings[index] = response.data;
          }
          this.closeModal();
        } else {
          console.error('Failed to update meeting:', response.message);
        }
      }, error => {
        console.error('Error updating meeting:', error);
      });
  }
}