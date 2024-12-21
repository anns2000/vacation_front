// auth.service.ts
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private user: any;

  constructor() {
    this.loadUserFromLocalStorage();
  }

  setUser(user: any) {
    this.user = user;
    localStorage.setItem('user', JSON.stringify(user));
  }

  getUser() {
    if (!this.user) {
      this.loadUserFromLocalStorage();
    }
    return this.user;
  }

  private loadUserFromLocalStorage() {
    const user = localStorage.getItem('user');
    if (user) {
      try {
        this.user = JSON.parse(user);
      } catch (e) {
        console.error('Failed to parse user from localStorage', e);
        this.user = null;
      }
    }
  }

  hasPermission(permission: string): boolean {
    if (this.user && this.user.roles) {
      for (const role of this.user.roles) {
        if (role.permissions && role.permissions.some((p: { name: string }) => p.name === permission)) {
          return true;
        }
      }
    }
    return false;
  }

  clearUser() {
    this.user = null;
    localStorage.removeItem('user');
  }
}