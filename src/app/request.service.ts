import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, map } from 'rxjs/operators';
import { ApiConfigService } from './api-config.service'; // Import the ApiConfigService

export interface Request {
  startDate: string;
  endDate: string;
  reason: string;
  requestType: {
    name: string;
    id: number;
    rowVersion: string;
    createdAt: string;
  };
  requestStatus: {
    name: string;
    id: number;
    rowVersion: string;
    createdAt: string;
  };
  id: number;
  createdAt: string;
  rowVersion: string;
  updatedAt: string;
  requestTypeId: number;
}
export interface RequestType {
  id: number;
  name: string;
}

export interface ResponseDTO<T> {
  data: T;
}

@Injectable({
  providedIn: 'root'
})
export class RequestService {
  private apiUrl!: string;
  private requestEndpoints!: any;

  constructor(private http: HttpClient, private apiConfigService: ApiConfigService) {
    this.apiConfigService.loadConfig().subscribe(config => {
      this.apiUrl = config.apiBaseUrl;
      this.requestEndpoints = config.request;
    }, error => {
      console.error('Failed to load API configuration', error);
    });
  }

  ensureConfigLoaded(): Observable<void> {
    if (this.apiUrl && this.requestEndpoints) {
      return new Observable((observer) => {
        observer.next();
        observer.complete();
      });
    } else {
      return this.apiConfigService.loadConfig().pipe(
        map((config) => {
          this.apiUrl = config.apiBaseUrl;
          this.requestEndpoints = config.request;
        })
      );
    }
  }

  getRequests(): Observable<Request[]> {
    if (!this.ensureConfigLoaded()) {
      return throwError('API configuration not loaded');
    }

    let headers = new HttpHeaders();

    return this.http.get<Request[]>(`${this.apiUrl}${this.requestEndpoints.getRequest}`, { headers }).pipe(
      catchError(error => {
        console.error('Failed to get requests', error);
        return throwError(error);
      })
    );
  }

  createRequest(request: Partial<Request & { requestTypeId: number }>): Observable<Request> {
    if (!this.ensureConfigLoaded()) {
      return throwError('API configuration not loaded');
    }

    let headers = new HttpHeaders();

    return this.http.post<Request>(`${this.apiUrl}${this.requestEndpoints.addRequest}`, request, { headers }).pipe(
      catchError(error => {
        console.error('Failed to create request', error);
        return throwError(error);
      })
    );
  }

  getRequestTypes(): Observable<ResponseDTO<RequestType[]>> {
    if (!this.ensureConfigLoaded()) {
      return throwError('API configuration not loaded');
    }

    let headers = new HttpHeaders();

    return this.http.get<ResponseDTO<RequestType[]>>(`${this.apiUrl}${this.requestEndpoints.getRequestTypes}`, { headers }).pipe(
      catchError(error => {
        console.error('Failed to get request types', error);
        return throwError(error);
      })
    );
  }

  updateRequest(request: Request): Observable<HttpResponse<Request>> {
    if (!this.ensureConfigLoaded()) {
      return throwError('API configuration not loaded');
    }

    let headers = new HttpHeaders();

    const payload = {
      ...request,
      requestTypeId: request.requestType.id
    };

    return this.http.put<Request>(`${this.apiUrl}${this.requestEndpoints.updateRequest}/${request.id}`, payload, { headers, observe: 'response' }).pipe(
      catchError(error => {
        console.error('Failed to update request', error);
        return throwError(error);
      })
    );
  }

  cancelRequest(requestId: number): Observable<void> {
    if (!this.ensureConfigLoaded()) {
      return throwError('API configuration not loaded');
    }

    let headers = new HttpHeaders();

    const cancelUrl = this.requestEndpoints.cancel.replace('{id}', requestId.toString());
    return this.http.put<void>(`${this.apiUrl}${cancelUrl}`, {}, { headers }).pipe(
      catchError(error => {
        console.error('Failed to cancel request', error);
        return throwError(error);
      })
    );
  }
}