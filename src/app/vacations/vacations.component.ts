import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RequestService, Request } from '../request.service';
import { EditRequestComponent } from '../edit-request/edit-request.component';
import { NewRequestComponent } from '../new-request/new-request.component';

@Component({
  selector: 'app-vacations',
  templateUrl: './vacations.component.html',
  styleUrls: ['./vacations.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    EditRequestComponent,
    NewRequestComponent,
  ],
})
export class VacationsComponent implements OnInit {
  requests: Request[] = [];
  isNewRequestModalOpen = false;
  isEditRequestModalOpen = false;
  selectedRequest: Request | null = null;
  successMessage: string | null = null;

  constructor(private requestService: RequestService) {}

  ngOnInit(): void {
    this.loadRequests();
  }

  loadRequests(): void {
    this.requestService.ensureConfigLoaded().subscribe(
      () => {
        this.requestService.getRequests().subscribe((data: Request[]) => {
          this.requests = data;
        });
      },
      (error) => {
        console.error('Failed to load API configuration', error);
      }
    );
  }

  openNewRequestModal(): void {
    this.isNewRequestModalOpen = true;
  }

  closeNewRequestModal(): void {
    this.isNewRequestModalOpen = false;
  }

  openEditRequestModal(request: Request): void {
    this.selectedRequest = request;
    this.isEditRequestModalOpen = true;
  }

  closeEditRequestModal(): void {
    this.isEditRequestModalOpen = false;
    this.selectedRequest = null;
  }

  onRequestCreated(newRequest: Request): void {
    this.requests.push(newRequest);
    this.closeNewRequestModal();
    this.loadRequests();
  }

  onRequestUpdated(updatedData: { request: Request; message: string }): void {
    const index = this.requests.findIndex(
      (r) => r.id === updatedData.request.id
    );
    if (index !== -1) {
      this.requests[index] = { ...updatedData.request };
    }
    this.successMessage = updatedData.message;
    this.closeEditRequestModal();
  }

  onRequestCancelled(): void {
    this.closeEditRequestModal();
    this.loadRequests();
  }
}