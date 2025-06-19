// frontend\src\app\notification\notification.component.ts


import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NotificationService } from '../notification.service';

@Component({
  selector: 'app-notification',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './notification.component.html'
})
export class NotificationComponent {
  constructor(public notificationService: NotificationService) {}
}
