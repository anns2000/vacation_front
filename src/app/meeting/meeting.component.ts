import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { MeetingService } from './meeting.service';
import { Meeting } from '../models/meeting.model';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-meeting',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './meeting.component.html',
  styleUrls: ['./meeting.component.css']
})
export class MeetingComponent implements OnInit {
  meetings: Meeting[] = [];
  selectedMeeting: Meeting | null = null;

  constructor(private meetingService: MeetingService, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadMeetings();
  }

  loadMeetings(): void {
    this.meetingService.getMeetings().subscribe(response => {
      if (response.success) {
        this.meetings = response.data;
      } else {
        this.toastr.error('Failed to load meetings');
      }
    }, error => {
      this.toastr.error('Error loading meetings:', error);
    });
  }

  selectMeeting(meeting: Meeting): void {
    this.selectedMeeting = { ...meeting };
  }

  closeModal(): void {
    this.selectedMeeting = null;
  }

  saveMeeting(): void {
    if (this.selectedMeeting) {
      // Create a new object with ParticipantsIds list
      const meetingToUpdate = {
        ...this.selectedMeeting,
        ParticipantsIds: this.selectedMeeting.participants.map(p => p.id)
      };
  
      this.meetingService.updateMeeting(meetingToUpdate).subscribe({
        next: response => {
          if (response.success) {
            this.toastr.success('Meeting updated successfully');
            this.loadMeetings();
            this.closeModal();
          } else {
            this.toastr.error('Failed to update meeting');
          }
        },
        error: response => {
          console.error('Error updating meeting:', response);
          //this.toastr.error(response);
        }
      });
    }
  }
}