import { Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService, Request, RequestType } from '../request.service';

@Component({
  selector: 'app-new-request',
  templateUrl: './new-request.component.html',
  styleUrls: ['./new-request.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class NewRequestComponent {
  @Output() requestCreated = new EventEmitter<Request>();
  requestTypes: RequestType[] = [];
  newRequest: Request = {
    startDate: '',
    endDate: '',
    reason: '',
    requestType: {
      name: '',
      id: 0,
      rowVersion: '',
      createdAt: ''
    },
    requestStatus: {
      name: '',
      id: 0,
      rowVersion: '',
      createdAt: ''
    },
    id: 0,
    createdAt: '',
    rowVersion: '', // Add this line
    updatedAt: '', // Add this line
    requestTypeId: 0 // Add this line
  };

  constructor(private requestService: RequestService) {
    this.fetchRequestTypes();
  }

  fetchRequestTypes(): void {
    this.requestService.getRequestTypes().subscribe((response) => {
      this.requestTypes = response.data;
    });
  }

  createRequest(): void {
    this.newRequest.requestTypeId = this.newRequest.requestType.id; // Ensure requestTypeId is set
    this.requestService.createRequest(this.newRequest).subscribe((createdRequest) => {
      this.requestCreated.emit(createdRequest);
    });
  }
}