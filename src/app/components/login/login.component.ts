import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

import { MatCardModule } from '@angular/material/card';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar'; 

import { AuthService } from '../../services/auth.service';
import { Login } from '../../interfaces/login.interface';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [ 
    CommonModule,
    FormsModule, 
    MatCardModule, 
    MatInputModule, 
    MatButtonModule, 
    MatFormFieldModule, 
    MatIconModule,
    MatSnackBarModule 
  ],
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {

  hidePassword: boolean = true;
  forgotMode: boolean = false;

  loginObj: Login = {
    email: '',
    password: ''
  }

  constructor(
    private ser: AuthService,
    private router: Router,
    private snackBar: MatSnackBar 
  ) { }

  toggleForgotMode(mode: boolean) {
    this.forgotMode = mode;
    if (!mode) {
      this.loginObj.password = '';
    }
  }

  login() {
    this.ser.login(this.loginObj).subscribe({
      next: (res: any) => {
        localStorage.setItem("user", JSON.stringify(res));
        localStorage.setItem("role", res.role);

        const targetRoute = res.role == "Admin" ? '/dashboard' : '/task';

        this.router.navigate([targetRoute]).then(() => {
          this.snackBar.open('Login Successful!', 'Close', {
            duration: 2500, 
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
        });
      },
      error: () => {
        this.snackBar.open('Invalid Email or Password', 'Close', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }

  forgotPassword() {
    this.ser.forgotPassword(this.loginObj.email).subscribe({
      next: () => {
        this.snackBar.open('Password reset link has been sent to your email.', 'Close', {
          duration: 3500,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.toggleForgotMode(false);
      },
      error: (err: any) => {
        console.error(err);
        this.snackBar.open('Failed to send reset link. Please verify your email.', 'Close', {
          duration: 3500,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
      }
    });
  }
}