import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-profile-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatSnackBarModule
  ],
  templateUrl: './profile-settings.component.html',
  styleUrl: './profile-settings.component.css'
})
export class ProfileSettingsComponent implements OnInit {

  profileObj: any = {
    fullName: '',
    email: '',
    role: '',
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  };

  profilePic: string = 'assets/mohanish.jpg';
  selectedFile: File | null = null;

  constructor(
    private authService: AuthService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    if (userData) {
      const user = JSON.parse(userData);
      const userObj = user.data || user;
      
      this.profileObj.fullName = userObj.userName || '';
      this.profileObj.email = userObj.userEmail || '';
      this.profileObj.role = userObj.role === '1' || userObj.role === 'Admin' ? 'Admin / Developer' : 'User / Team Member';
      this.profilePic = userObj.profilePic || 'assets/mohanish.jpg';
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      if (file.size > 819200) {
        this.snackBar.open('File size exceeds 800KB limit!', 'Close', { duration: 3000 });
        return;
      }
      this.selectedFile = file;
      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.profilePic = e.target.result;
      };
      reader.readAsDataURL(file);
    }
  }

  updateProfile(): void {
    if (this.profileObj.newPassword && this.profileObj.newPassword !== this.profileObj.confirmPassword) {
      this.snackBar.open('New Password and Confirm Password do not match!', 'Close', { duration: 3000 });
      return;
    }

    this.snackBar.open('Profile updated successfully!', 'Close', {
      duration: 3000,
      horizontalPosition: 'right',
      verticalPosition: 'top'
    });
  }
}