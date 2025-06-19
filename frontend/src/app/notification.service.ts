// frontend\src\app\notification.service.ts
import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  id: number;
  message: string;
  type: 'success' | 'danger';
}

@Injectable({
  providedIn: 'root'
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notification[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  private idCounter = 0;

  show(message: string, type: 'success' | 'danger') {
    const id = this.idCounter++;
    const current = this.notificationsSubject.getValue();
    this.notificationsSubject.next([...current, { id, message, type }]);
    setTimeout(() => this.remove(id), 3000);
  }

  remove(id: number) {
    const filtered = this.notificationsSubject.getValue().filter(n => n.id !== id);
    this.notificationsSubject.next(filtered);
  }
}
