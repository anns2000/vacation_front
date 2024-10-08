import { Component } from '@angular/core';
import { RouterModule } from '@angular/router'; // Import RouterModule
import { SidebarComponent } from '../sidebar/sidebar.component'; // Import SidebarComponent

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
  standalone: true,
  imports: [RouterModule, SidebarComponent] // Import RouterModule and SidebarComponent
})
export class HomeComponent {}