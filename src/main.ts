import { bootstrapApplication } from '@angular/platform-browser';
import { HTTP_INTERCEPTORS, provideHttpClient, withInterceptorsFromDi } from '@angular/common/http';
import { provideRouter, Routes } from '@angular/router';
import { AppComponent } from './app/app.component';
import { LandingComponent } from './app/landing/landing.component';
import { LoginComponent } from './app/login/login.component';
import { CreateAccountComponent } from './app/create-account/create-account.component';
import { HomeComponent } from './app/home/home.component';
import { OtpComponent } from './app/otp/otp.component';
import { SidebarComponent } from './app/sidebar/sidebar.component';
import { VacationsComponent } from './app/vacations/vacations.component';
import { NewRequestComponent } from './app/new-request/new-request.component';
import { EditRequestComponent } from './app/edit-request/edit-request.component';
import { ManagerComponent } from './app/manager/manager.component';
import { MeetingComponent } from './app/meeting/meeting.component';
import { AttendanceScreenComponent } from './app/attendance-screen/attendance-screen.component';
import { AuthGuard } from './app/auth.guard';
import { AuthInterceptor } from './app/auth.interceptor';
import { ResponseInterceptor } from './app/response.interceptor';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { importProvidersFrom } from '@angular/core';
import { Error403Component } from './app/error403/error403.component'; // Import the Error403Component
import { RolesComponent } from './app/roles/roles.component'; // Import the RolesComponent
import { UsersComponent } from './app/users/users.component'; // Import the UsersComponent

const routes: Routes = [
  { path: '', component: LandingComponent },
  { path: 'login', component: LoginComponent },
  { path: 'create-account', component: CreateAccountComponent },
  { path: 'home', component: HomeComponent, canActivate: [AuthGuard], children: [
    { path: 'vacations', component: VacationsComponent },
    { path: 'manager', component: ManagerComponent },
    { path: 'meetings', component: MeetingComponent },
    { path: 'attendance', component: AttendanceScreenComponent },
    { path: 'roles', component: RolesComponent }, 
    { path: 'users', component: UsersComponent },

  ]},
  { path: 'otp', component: OtpComponent },
  { path: '403', component: Error403Component }, // Add the 403 route
  { path: '**', redirectTo: '/' } // Fallback route
];

bootstrapApplication(AppComponent, {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    { provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: ResponseInterceptor, multi: true },
    AuthGuard,
    importProvidersFrom(
      BrowserAnimationsModule, // Required animations module
      ToastrModule.forRoot() // ToastrModule added
    )
  ]
}).catch(err => console.error(err));