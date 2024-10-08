import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ActivatedRoute, Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-otp',
  templateUrl: './otp.component.html',
  styleUrls: ['./otp.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class OtpComponent implements OnInit {
  email: string = '';
  otp: string[] = new Array(6).fill('');

  constructor(private http: HttpClient, private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.queryParams.subscribe(params => {
      this.email = params['email'];
    });
  }

  onKeyDown(event: KeyboardEvent, index: number) {
    const input = event.target as HTMLInputElement;
    if (event.key === 'Backspace' && !input.value && index > 0) {
      const prevInput = document.querySelectorAll('.otp-input')[index - 1] as HTMLInputElement;
      prevInput.focus();
    }
  }

  onInput(event: Event, index: number) {
    const input = event.target as HTMLInputElement;
    const value = input.value;

    // Ensure only one character is entered
    if (value.length > 1) {
      input.value = value.charAt(0);
    }

    // Update the OTP array
    this.otp[index] = input.value;

    // Move to the next input if the current one is filled
    if (input.value.length === 1 && index < this.otp.length - 1) {
      const nextInput = document.querySelectorAll('.otp-input')[index + 1] as HTMLInputElement;
      nextInput.focus();
    }
  }

  submitOtp() {
    const otpValue = this.otp.join('');
    console.log('OTP Submitted:', otpValue);

    // Call the verify API
    const otpData = { email: this.email, otp: otpValue };
    this.http.post<{ success: boolean, message: string }>('http://localhost:5146/api/Auth/verifyOtp', otpData)
      .subscribe(response => {
        console.log('API Response:', response); // Log the response
        if (response.success) {
          alert('OTP verified successfully');
          this.router.navigate(['/login']);
        } else {
          alert('Invalid OTP');
        }
      }, error => {
        console.error('Error verifying OTP:', error); // Log the error
        alert('An error occurred while verifying the OTP. Please try again.');
      });
  }
}