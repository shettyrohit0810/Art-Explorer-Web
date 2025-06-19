// frontend/src/app/auth/register/register.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
  registerData = { fullname: '', email: '', password: '' };
  errorMessage = '';
  emailServerError = '';


  constructor(private auth: AuthService, private router: Router) {}

  onRegister(form?: any) {
    this.errorMessage = '';
  
    if (form && form.invalid) {
      form.control.markAllAsTouched();
      return;
    }
  
    this.auth.register(this.registerData).subscribe({
      next: () => this.router.navigate(['/search']),
      error: (e: any) => {
        const msg = e.error?.message || 'Registration failed';
  
        // If error is about email, show it near the email field
        if (msg.toLowerCase().includes('email')) {
          this.emailServerError = msg;
        } else {
          this.errorMessage = msg;
        }
      }
    });
  }
  
  

  // Focus on the next field when pressing Enter
  focusNext(event: any, nextField: any): void {
    event.preventDefault();
    nextField?.nativeElement.focus();
  }
}
