import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AddRoleComponent } from '../add-role/add-role.component';
import { EditRoleComponent } from '../edit-role/edit-role.component';

@Component({
  selector: 'app-roles',
  standalone: true,
  imports: [CommonModule, FormsModule, AddRoleComponent, EditRoleComponent],
  templateUrl: './roles.component.html',
  styleUrls: ['./roles.component.css']
})
export class RolesComponent implements OnInit, AfterViewInit {
  @ViewChild('editRoleComponent') editRoleComponent!: EditRoleComponent;

  roles: {
    name: string;
    permissions: {
      name: string;
      id: number;
      rowVersion: string;
      createdAt: string;
      updatedAt: string;
    }[];
    id: number;
    rowVersion: string;
    createdAt: string;
    updatedAt: string;
  }[] = [];
  isAddRoleModalOpen = false;

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadRoles();
  }

  ngAfterViewInit(): void {
    // Ensure the ViewChild is initialized
    if (!this.editRoleComponent) {
      console.error('EditRoleComponent is not initialized');
    }
  }

  loadRoles(): void {
    this.http.get('http://localhost:5146/api/RoleManagement').subscribe(
      (response: any) => {
        if (response.success) {
          this.roles = response.data;
        } else {
          this.toastr.error('Failed to load roles', 'Error');
        }
      },
      (error) => {
        this.toastr.error('Failed to load roles', 'Error');
      }
    );
  }

  openAddRoleModal(): void {
    this.isAddRoleModalOpen = true;
  }

  closeAddRoleModal(): void {
    this.isAddRoleModalOpen = false;
  }

  onRoleCreated(roleName: string): void {
    const newRole = { name: roleName };

    this.http.post('http://localhost:5146/api/RoleManagement', newRole).subscribe(
      () => {
        this.toastr.success('Role added successfully', 'Success');
        this.loadRoles();
        this.closeAddRoleModal();
      },
      (error) => {
        this.toastr.error('Failed to add role', 'Error');
      }
    );
  }

  openEditRoleModal(role: any): void {
    if (this.editRoleComponent) {
      this.editRoleComponent.openEditRoleModal(role);
    } else {
      console.error('EditRoleComponent is not available');
    }
  }

  onRoleUpdated(updatedRole: any): void {
    this.http.put(`http://localhost:5146/api/RoleManagement/${updatedRole.id}`, updatedRole).subscribe(
      () => {
        this.toastr.success('Role updated successfully', 'Success');
        this.loadRoles();
      },
      (error) => {
        this.toastr.error('Failed to update role', 'Error');
      }
    );
  }

  onRoleCancelled(): void {
    // Handle role cancelled logic if needed
  }
}