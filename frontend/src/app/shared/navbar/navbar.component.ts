// frontend\src\app\shared\navbar\navbar.component.ts
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router'; // <-- import RouterModule
import { AuthService } from '../../auth/auth.service';
import { NotificationService } from '../../notification.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule, RouterModule], //  <-- Add RouterModule here
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css']
})
export class NavbarComponent {
  constructor(
    public authService: AuthService,
    private notificationService: NotificationService,
    private router: Router
  ) {}

  // navbar.component.ts (REMOVE toast here)
    logout() {
      this.authService.logout().subscribe({
        next: () => {
          this.router.navigate(['/login']);
        },
        error: () => this.notificationService.show('Logout failed', 'danger')
      });
    }

  
  

  deleteAccount() {
    if (confirm('Are you sure you want to delete your account?')) {
      this.authService.deleteAccount().subscribe({
        next: () => {
          this.notificationService.show('Account deleted', 'danger');
          this.router.navigate(['/register']);
        },
        error: () => this.notificationService.show('Failed to delete account', 'danger')
      });
    }
  }
}

