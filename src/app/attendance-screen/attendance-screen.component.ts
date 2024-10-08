import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ApiConfigService } from '../api-config.service'; // Import the service
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-attendance-screen',
  templateUrl: './attendance-screen.component.html',
  styleUrls: ['./attendance-screen.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class AttendanceScreenComponent implements OnInit {
  checkInTime: string | null = null;
  checkOutTime: string | null = null;

  constructor(
    private httpClient: HttpClient,
    private apiConfigService: ApiConfigService // Inject the service
  ) {}

  ngOnInit(): void {
    this.fetchTodayAttendance();
  }

  private getToken(): string | null {
    return localStorage.getItem('token');
  }

  fetchTodayAttendance() {
    const token = this.getToken();
    if (token) {
      this.apiConfigService.loadConfig().subscribe((config) => {
        const url = `${config.apiBaseUrl}${config.attendance.getAttendance}`;
        console.log('Fetching attendance', url);
        this.httpClient.get(url, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
          next: (response: any) => {
            if (response.success) {
              this.checkInTime = response.data.checkIn ? this.formatTime(response.data.checkIn) : null;
              this.checkOutTime = response.data.checkOut ? this.formatTime(response.data.checkOut) : null;
            }
          },
          error: (error) => {
            console.error('Failed to fetch attendance', error);
          }
        });
      });
    } else {
      alert('Token not found. Please log in again.');
    }
  }

  checkIn() {
    const token = this.getToken();
    if (token) {
      this.apiConfigService.loadConfig().subscribe((config) => {
        const url = `${config.apiBaseUrl}${config.attendance.checkIn}`;
        this.httpClient.post(url, {}, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
          next: (response: any) => {
            this.checkInTime = response.checkInTime ? this.formatTime(response.checkInTime) : null;
            console.log('Check-in successful', response);
            this.fetchTodayAttendance();
          },
          error: (error) => {
            console.error('Check-in failed', error);
            alert(error.errors.join('\n'));
          }
        });
      });
    } else {
      alert('Token not found. Please log in again.');
    }
  }

  checkOut() {
    const token = this.getToken();
    if (token) {
      this.apiConfigService.loadConfig().subscribe((config) => {
        const url = `${config.apiBaseUrl}${config.attendance.checkOut}`;
        this.httpClient.post(url, {}, {
          headers: { Authorization: `Bearer ${token}` }
        }).subscribe({
          next: (response: any) => {
            this.checkOutTime = response.checkOutTime ? this.formatTime(response.checkOutTime) : null;
            console.log('Check-out successful', response);
            this.fetchTodayAttendance();
          },
          error: (error) => {
            console.error('Check-out failed', error);
            alert(error.errors.join('\n'));
          }
        });
      });
    } else {
      alert('Token not found. Please log in again.');
    }
  }

  formatTime(time: string): string {
    return new Date(time).toLocaleTimeString();
  }
}