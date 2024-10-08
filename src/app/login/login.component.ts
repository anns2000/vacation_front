import { Component } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class LoginComponent {
  username = '';
  password = '';

  constructor(private router: Router, private http: HttpClient) {}

  login(event: Event) {
    event.preventDefault();
    const loginData = { username: this.username, password: this.password };
    this.http.post('http://localhost:5146/api/auth/login', loginData).subscribe(
      (response: any) => {
        if (response.data) {
          localStorage.setItem('token', response.data); 
          this.router.navigate(['/home/attendance']);
        }
      },
      (error: any) => {
        console.error('Login failed', error);
      }
    );
  }

  navigateToRegister(event: Event) {
    event.preventDefault();
    this.router.navigate(['/register']);
  }
}