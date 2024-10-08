import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService, Request, RequestType } from '../request.service';
import { HttpClient, HttpResponse } from '@angular/common/http';

@Component({
  selector: 'app-edit-request',
  templateUrl: './edit-request.component.html',
  styleUrls: ['./edit-request.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class EditRequestComponent implements OnInit {
  @Input() request: Request | null = null;
  @Output() requestUpdated = new EventEmitter<{ request: Request, message: string }>();
  @Output() requestCancelled = new EventEmitter<void>();
  requestTypes: RequestType[] = [];

  constructor(private requestService: RequestService, private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchRequestTypes();
  }

  fetchRequestTypes(): void {
    this.requestService.getRequestTypes().subscribe((response) => {
      this.requestTypes = response.data;
    });
  }

  updateRequest(): void {
    if (this.request) {
      this.requestService.updateRequest(this.request).subscribe((response: HttpResponse<Request>) => {
        const updatedRequest = response.body as Request;
        const message = response.headers.get('message') || 'Request updated successfully.';
        this.requestUpdated.emit({ request: updatedRequest, message });
      });
    }
  }

  cancelRequest(): void {
    if (this.request) {
      this.requestService.cancelRequest(this.request.id).subscribe(() => {
        this.requestCancelled.emit();
      });
    }
  }
}