import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

interface ApiConfig {
  apiBaseUrl: string;
  attendance: {
    checkIn: string;
    checkOut: string;
    getAttendance: string;
  };
  auth: {
    login: string;
    register: string;
    verifyOtp: string;
  };
  request: {
    getRequest: string;
    addRequest: string;
    updateRequest: string;
  };
}

@Injectable({
  providedIn: 'root'
})
export class ApiConfigService {
  private configUrl = 'assets/api-config.json';
  private config: ApiConfig | undefined;

  constructor(private http: HttpClient) {}

  loadConfig(): Observable<ApiConfig> {
    if (this.config) {
      return new Observable((observer) => {
        observer.next(this.config);
        observer.complete();
      });
    } else {
      return this.http.get<ApiConfig>(this.configUrl).pipe(
        map((config) => {
          this.config = config;
          return config;
        })
      );
    }
  }

  get apiBaseUrl(): string {
    return this.config ? this.config.apiBaseUrl : '';
  }

  get attendanceEndpoints(): any {
    return this.config ? this.config.attendance : {};
  }

  get authEndpoints(): any {
    return this.config ? this.config.auth : {};
  }

  get requestEndpoints(): any {
    return this.config ? this.config.request : {};
  }
}