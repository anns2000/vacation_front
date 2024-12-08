import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest, HttpErrorResponse } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Router } from '@angular/router';
import { ToastrService } from 'ngx-toastr';

@Injectable()
export class ResponseInterceptor implements HttpInterceptor {

  constructor(private router: Router, private toastr: ToastrService) {}

  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((error: HttpErrorResponse) => this.handleError(error))
    );
  }

  private handleError(error: HttpErrorResponse): Observable<never> {
   

    console.log("anas"); 

    if (error.status === 401) {
      this.router.navigate(['/login']).then(() => {
        console.log('Navigation to /login successful');
      }).catch((navError) => {
        console.error('Navigation to /login failed', navError);
      });
    } else if (error.status === 403) {
      this.toastr.error('You are not authorized to access this resource', 'Error');
      this.router.navigate(['/403']).then(() => {
        console.log('Navigation to /403 successful');
      }).catch((navError) => {
        console.error('Navigation to /403 failed', navError);
      });
    } else {
      console.log('Error:', error);
      this.toastr.error(error.error.message||error.error.errors[0]); // Show a generic error message
 
    }

    return throwError(() => new Error(error.message));
  }
}