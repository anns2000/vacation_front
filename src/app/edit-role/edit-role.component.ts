import { Component, Input, Output, EventEmitter, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-edit-role',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './edit-role.component.html',
  styleUrls: ['./edit-role.component.css']
})
export class EditRoleComponent implements OnInit {
  @Input() role: any;
  @Output() roleUpdated = new EventEmitter<any>();
  @Output() roleCancelled = new EventEmitter<void>();

  isEditRoleModalOpen = false;
  newPermission = '';
  allPermissions: any[] = [];

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.fetchPermissions();
  }

  openEditRoleModal(role: any): void {
    this.role = { ...role };
    this.isEditRoleModalOpen = true;
  }

  closeEditRoleModal(): void {
    this.isEditRoleModalOpen = false;
    this.roleCancelled.emit();
  }

  onSubmit(): void {
    this.roleUpdated.emit(this.role);
    this.closeEditRoleModal();
  }

  onCancel(): void {
    this.closeEditRoleModal();
  }

  fetchPermissions(): void {
    this.http.get('http://localhost:5146/api/Permissions').subscribe(
      (response: any) => {
        this.allPermissions = response;
        console.log('Fetched permissions:', this.allPermissions); // Log fetched data
      },
      (error) => {
        console.error('Failed to fetch permissions', error);
      }
    );
  }

  addPermission(): void {
    if (this.newPermission.trim()) {
      const permission = this.allPermissions.find(p => p.name === this.newPermission);
      if (permission) {
        const roleId = this.role.id;
        const permissionId = permission.id;
        this.http.post(`http://localhost:5146/api/RoleManagement/${roleId}/permissions/${permissionId}`, {}).subscribe(
          (response: any) => {
            console.log('Permission added:', response);
            this.role.permissions.push(permission);
            this.newPermission = '';
            this.toastr.success('Permission added successfully'); 
          },
          (error) => {
            console.error('Failed to add permission', error);
            this.toastr.error('Failed to add permission'); 
          }
        );
      }
    }
  }

  removePermission(index: number): void {
  const permission = this.role.permissions[index];
  const roleId = this.role.id;
  const permissionId = permission.id;

  this.http.delete(`http://localhost:5146/api/RoleManagement/${roleId}/permissions/${permissionId}`).subscribe(
    (response: any) => {
      console.log('Permission removed:', response);
      this.role.permissions.splice(index, 1);
      this.toastr.success('Permission removed successfully'); // Show success message
    },
    (error) => {
      console.error('Failed to remove permission', error);
      this.toastr.error('Failed to remove permission'); // Show error message
    }
  );
}
}