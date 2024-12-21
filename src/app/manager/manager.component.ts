import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { ToastrService } from 'ngx-toastr';

interface User {
  username: string;
}

interface RequestStatus {
  name: string;
}
interface RequestType {
  name: string;
}

interface Request {
  id: string;
  startDate: string;
  endDate: string;
  requestStatus: RequestStatus; // Nested requestStatus object
  requestType: RequestType; // Corrected to lowercase requestType
  user: User; // Nested user object
  rowVersion: string;
}

interface Config {
  apiBaseUrl: string;
  manager: {
    loadRequests: string;
    acceptRequest: string;
    rejectRequest: string;
  };
}

@Component({
  selector: 'app-manager',
  templateUrl: './manager.component.html',
  styleUrls: ['./manager.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class ManagerComponent implements OnInit {
  requests: Request[] = [];
  selectedRequest?: Request;
  config?: Config;

  constructor(private http: HttpClient , private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadConfig().then(() => {
      this.loadRequests();
    });
  }

  async loadConfig(): Promise<void> {
    try {
      const config = await this.http.get<Config>('assets/api-config.json').toPromise();
      this.config = config;
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  loadRequests(): void {
    if (this.config) {
      const url = `${this.config.apiBaseUrl}${this.config.manager.loadRequests}`;
      this.http.get<{ success: boolean, message: string, data: Request[] }>(url)
        .subscribe(response => {
          if (response.success) {
            this.requests = response.data.map(request => ({
              ...request,
              startDate: new Date(request.startDate).toISOString(), // Ensure date format
              endDate: new Date(request.endDate).toISOString() // Ensure date format
            }));
          } else {
            console.error('Failed to fetch requests:', response.message);
          }
        }, error => {
          console.error('Error fetching requests:', error);
        });
    }
  }

  onRowClick(request: Request): void {
    if (request.requestStatus.name === 'Pending') {
      this.selectedRequest = request;
    }
  }
  
  onCloseModal(): void {
    this.selectedRequest = undefined;
  }
  
  onAcceptRequest(): void {
    if (this.selectedRequest && this.config) {
      const url = `${this.config.apiBaseUrl}${this.config.manager.acceptRequest.replace('{id}', this.selectedRequest.id)}`;
      const body = { rowVersion: this.selectedRequest.rowVersion };
      this.http.post(url, body).subscribe(response => {
        this.onCloseModal();
        this.loadRequests(); // Refresh the screen
      }, error => {
        console.error('Error accepting request:', error);
        this.toastr.error('Error accepting request please refresh the page');
      });

    }
  }
  
  onRejectRequest(): void {
    if (this.selectedRequest && this.config) {
      const url = `${this.config.apiBaseUrl}${this.config.manager.rejectRequest.replace('{id}', this.selectedRequest.id)}`;
      const body = { rowVersion: this.selectedRequest.rowVersion };
      this.http.post(url, body).subscribe(response => {
        console.log('Request rejected');
        this.onCloseModal();
        this.loadRequests(); // Refresh the screen
      }, error => {
        console.error('Error rejecting request:', error);
        this.toastr.error('Error rejecting request please refresh the page');

      });
    }
  }
}