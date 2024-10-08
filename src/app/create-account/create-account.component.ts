import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-create-account',
  templateUrl: './create-account.component.html',
  styleUrls: ['./create-account.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class CreateAccountComponent {
  username: string = '';
  email: string = '';
  password: string = '';
  confirmPassword: string = '';
  alertMessage: string = '';
  alertType: string = '';
  errors: string[] = []; // Add errors property

  constructor(private http: HttpClient, private router: Router) {}

  createAccount(): void {
    const user = { username: this.username, email: this.email, password: this.password, confirmPassword: this.confirmPassword };

    this.http.post<{ success: boolean, message: string, data: any, errors: string[] }>('http://localhost:5146/api/Auth/register', user)
      .subscribe(response => {
        console.log('API response:', response); // Log the API response
        if (response.success) {
          // Navigate to OTP screen after successful registration
          this.router.navigate(['/otp'], { queryParams: { email: this.email } });
        } else {
          // Set error message and errors if registration fails
          this.alertMessage = response.message;
          this.alertType = 'error';
          this.errors = response.errors || [];
        }
      }, error => {
        console.error('API error:', error); // Log the error
        // Set error message if there is an error during the request
        this.alertMessage = 'An error occurred during registration. Please try again.';
        this.alertType = 'error';
        this.errors = [];
      });
  }

  navigateToLogin(event: Event): void {
    event.preventDefault();
    this.router.navigate(['/login']);
  }
}