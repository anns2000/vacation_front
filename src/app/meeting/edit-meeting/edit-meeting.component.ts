import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

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
  selector: 'app-edit-meeting',
  templateUrl: './edit-meeting.component.html',
  styleUrls: ['./edit-meeting.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditMeetingComponent {
  @Input() meeting: Meeting | null = null;
  @Output() save = new EventEmitter<Meeting>();
  @Output() close = new EventEmitter<void>();

  onSave(): void {
    if (this.meeting) {
      this.save.emit(this.meeting);
    }
  }

  onClose(): void {
    this.close.emit();
  }
}