import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { MatToolbarModule } from '@angular/material/toolbar';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatButtonModule } from '@angular/material/button'; 

import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatToolbarModule,
    MatIconModule,
    MatInputModule,
    MatFormFieldModule,
    MatButtonModule
  ],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent implements OnInit {

  searchText: string = '';
  userName: string = 'User'; 
  profilePic: string = 'assets/mohanish.jpg'; 

  constructor(
    private router: Router, 
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const userData = localStorage.getItem('user');
    
    if (userData) {
      const user = JSON.parse(userData);
      const userObj = user.data || user.Data || user;
      
      this.userName = userObj.userName || userObj.UserName || 'User';
      this.profilePic = userObj.profilePic || userObj.ProfilePic || 'assets/mohanish.jpg';

      const userId = userObj.userId || userObj.UserId || userObj.id;

      if (userId) {
        this.authService.getProfile(userId).subscribe({
          next: (res: any) => {
            const profileData = res.data || res.Data || res;
            if (profileData) {
              this.userName = profileData.userName || profileData.UserName || this.userName;
              this.profilePic = profileData.profilePic || profileData.ProfilePic || this.profilePic;
            }
          },
          error: (err: any) => {
            console.error('Database profile sync failed, keeping local data.', err);
          }
        });
      }
    }
  }

  handleImageError() {
    this.profilePic = 'assets/mohanish.jpg';
  }

  logout() {
    localStorage.removeItem('user');
    localStorage.removeItem('role');
    this.router.navigate(['/login']);
  }
}