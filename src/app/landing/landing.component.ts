// src/app/landing/landing.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-landing',
  templateUrl: './landing.component.html',
  styleUrls: ['./landing.component.css'],
  standalone: true,
  imports: [CommonModule]
})
export class LandingComponent {
  title = 'Vacation Management System';
  description = 'Manage your vacations and requests efficiently.';
 

  constructor(private router: Router) {}

  navigateToLogin() {
    this.router.navigate(['/login']);
  }

  navigateToCreateAccount() {
    // Assuming you will create a create-account component later
    this.router.navigate(['/create-account']);
  }
}