// frontend/src/app/auth/login/login.component.ts
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NgIf } from '@angular/common';
import { RouterModule, Router } from '@angular/router'; // Import RouterModule
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, NgIf, RouterModule], // Add RouterModule
  templateUrl: './login.component.html'
})
export class LoginComponent {
  loginData = { email: '', password: '' };
  errorMessage = '';

  constructor(private auth: AuthService, private router: Router) {}

  onLogin(form?: any) {
    if (form?.invalid) {
      form.control.markAllAsTouched();
      return;
    }
  
    this.errorMessage = '';
    this.auth.login(this.loginData).subscribe({
      next: () => this.router.navigate(['/search']),
      error: (e: any) => {
        const backendMessage = e.error?.message?.toLowerCase() || '';
      
        // Generalize for either incorrect password or user not found
        if (backendMessage.includes('password') || backendMessage.includes('user') || backendMessage.includes('not found')) {
          this.errorMessage = 'Email or password is incorrect';
        } else {
          this.errorMessage = e.error.message || 'Login failed';
        }
      }
      
    });
  }
  
}
