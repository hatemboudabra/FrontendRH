import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Notifications } from '../../data/notif';

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private notificationsSubject = new BehaviorSubject<Notifications[]>([]);
  notifications$ = this.notificationsSubject.asObservable();

  addNotification(notification: Notifications) {
    const currentNotifications = this.notificationsSubject.value;
    this.notificationsSubject.next([...currentNotifications, notification]);
  }

  clearNotifications() {
    this.notificationsSubject.next([]);
  }
}