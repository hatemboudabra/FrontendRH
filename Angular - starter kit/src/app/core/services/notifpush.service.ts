/*
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

export interface NotifPush {
  title: string;
  message: string;
  timestamp: Date;
  from?: string;
}

@Injectable({
  providedIn: 'root'
})
export class NotifPushService {
  private notificationsSubject: BehaviorSubject<NotifPush[]> = new BehaviorSubject<NotifPush[]>([]);
  public notifications$: Observable<NotifPush[]> = this.notificationsSubject.asObservable();

  addNotification(notification: NotifPush) {
    const current = this.notificationsSubject.getValue();
    this.notificationsSubject.next([notification, ...current]);
  }
}
*/