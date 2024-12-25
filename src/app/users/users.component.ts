import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { ToastrService } from 'ngx-toastr';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Role {
  id: string;
  name: string;
}

interface Manager {
  username: string;
}

interface User {
  id: string;
  username: string;
  manager: Manager | null;
  roles: Role[];
}

interface Config {
  apiBaseUrl: string;
  attendance: {
    checkIn: string;
    checkOut: string;
    getAttendance: string;
  };
  auth: {
    login: string;
    register: string;
    verifyOtp: string;
  };
  request: {
    getRequest: string;
    addRequest: string;
    updateRequest: string;
    getRequestTypes: string;
    cancel: string;
  };
  manager: {
    loadRequests: string;
    acceptRequest: string;
    rejectRequest: string;
  };
  users: {
    loadUsers: string;
  };
}

@Component({
  selector: 'app-users',
  templateUrl: './users.component.html',
  styleUrls: ['./users.component.css'],
  standalone: true,
  imports: [CommonModule, FormsModule]
})
export class UsersComponent implements OnInit {
  users: User[] = [];
  availableRoles: Role[] = [];
  newRoleName: string = '';
  config?: Config;
isEditUserModalOpen = false;
  selectedUser?: User;
  selectedManagerId?: string; // Add this line

  constructor(private http: HttpClient, private toastr: ToastrService) {}

  ngOnInit(): void {
    this.loadConfig().then(() => {
      this.loadUsers();
      this.loadAvailableRoles();
    });
  }

  async loadConfig(): Promise<void> {
    try {
      const config = await this.http.get<Config>('assets/api-config.json').toPromise();
      this.config = config;
    } catch (error) {
      console.error('Error loading config:', error);
    }
  }

  loadUsers(): void {
    if (this.config) {
      const url = `${this.config.apiBaseUrl}${this.config.users.loadUsers}`;
      this.http.get<{ success: boolean, message: string, data: any[] }>(url)
        .subscribe(response => {
          if (response.success) {
            this.users = response.data.map(user => ({
              id: user.id,
              username: user.username,
              manager: user.manager ? { username: user.manager.username } : null,
              roles: user.roles.map((role: Role) => ({ id: role.id, name: role.name }))
            }));
          } else {
            console.error('Failed to fetch users:', response.message);
          }
        }, error => {
          console.error('Error fetching users:', error);
        });
    }
  }

  loadAvailableRoles(): void {
    const url = 'http://localhost:5146/api/RoleManagement';
    this.http.get<{ success: boolean, message: string, data: Role[] }>(url)
      .subscribe(response => {
        if (response.success) {
          this.availableRoles = response.data;
        } else {
          console.error('Failed to fetch roles:', response.message);
        }
      }, error => {
        console.error('Error fetching roles:', error);
      });
  }

  openEditUserModal(user: User): void {
    this.selectedUser = user;
    this.selectedManagerId = user.manager ? user.manager.username : undefined; // Add this line
    this.isEditUserModalOpen = true;
  }

  closeEditUserModal(): void {
    this.isEditUserModalOpen = false;
    this.selectedUser = undefined;
    this.selectedManagerId = undefined; // Add this line
  }

  addRole(): void {
    if (this.newRoleName && this.selectedUser) {
      const selectedRole = this.availableRoles.find(role => role.name === this.newRoleName);
      if (selectedRole) {
        const roleExists = this.selectedUser.roles.some(role => role.name === this.newRoleName);
        if (!roleExists) {
          const url = 'http://localhost:5146/assignRole';
          const body = {
            roleId: selectedRole.id,
            userId: this.selectedUser.id
          };
          this.http.post(url, body).subscribe(response => {
            if (this.selectedUser) { // Type guard to ensure this.selectedUser is defined
              this.selectedUser.roles.push({ id: selectedRole.id, name: this.newRoleName });
              console.log(`Role ${this.newRoleName} added to user ${this.selectedUser.username}`);
            }
          }, error => {
            console.error('Error assigning role:', error);
          });
        } else {
          this.toastr.error('Role already assigned to user', 'Error');
          console.log(`User already has the role ${this.newRoleName}`);
        }
      } else {
        console.log(`Role ${this.newRoleName} not found in available roles`);
      }
    } else {
      console.log('No role selected or no user selected');
    }
  }

  removeRole(role: Role, event: Event): void {
    event.stopPropagation();
    if (this.selectedUser) {
      const url = 'http://localhost:5146/removeRole';
      const body = {
        roleId: role.id,
        userId: this.selectedUser.id
      };
      this.http.request('DELETE', url, { body }).subscribe(response => {
        if (this.selectedUser) { // Type guard to ensure this.selectedUser is defined
          this.selectedUser.roles = this.selectedUser.roles.filter(r => r !== role);
        }
      }, error => {
        console.error('Error removing role:', error);
      });
    }
  }

  assignManager(): void { // Add this method
    if (this.selectedUser && this.selectedManagerId) {
      const url = 'http://localhost:5146/api/Manager/AssingManager';
      const body = {
        managerId: this.selectedManagerId,
        userId: this.selectedUser.id
      };

      this.http.post(url, body).subscribe(response => {
        
        if(response){
          this.toastr.success('Manager assigned successfully');
            this.loadUsers();

          
        }
        else
        {
          this.toastr.error('Error assigning manager');
        }

      }, error => {
        console.error('Error assigning manager:', error);
      });



    } else {
      this.toastr.error('No manager selected or no user selected', 'Error');
      console.log('No manager selected or no user selected');
    }
  }
}