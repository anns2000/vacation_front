import { Injectable } from '@angular/core';
import { HttpEvent, HttpInterceptor, HttpHandler, HttpRequest } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable()
export class AuthInterceptor implements HttpInterceptor {
  intercept(req: HttpRequest<any>, next: HttpHandler): Observable<HttpEvent<any>> {
    const token = localStorage.getItem('token'); // Get the token from localStorage

    console.log('AuthInterceptor: Intercepting request', req);
    if (token) {
      console.log('AuthInterceptor: Adding token to headers');
      // Clone the request and add the Authorization header
      const cloned = req.clone({
        headers: req.headers.set('Authorization', `Bearer ${token}`)
      });

      console.log('AuthInterceptor: Cloned request', cloned);
      return next.handle(cloned);
    } else {
      console.log('AuthInterceptor: No token found');
      return next.handle(req);
    }
  }
}