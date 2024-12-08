import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router'; // Import RouterModule for routing
import { CommonModule } from '@angular/common'; // Import CommonModule for ngIf
import { AuthService } from '../auth.service'; // Import AuthService

@Component({
  selector: 'app-sidebar',
  templateUrl: './sidebar.component.html',
  styleUrls: ['./sidebar.component.css'],
  standalone: true,
  imports: [RouterModule, CommonModule] // Import RouterModule and CommonModule
})
export class SidebarComponent {
  constructor(private router: Router, private authService: AuthService) {} // Inject AuthService

  hasPermission(permission: string): boolean {
    return this.authService.hasPermission(permission);
  }
  logout() {
    localStorage.removeItem('token'); // Remove the token from localStorage
    this.authService.clearUser(); // Clear the user data
    this.router.navigate(['/login']); // Navigate to the login page
  }
}