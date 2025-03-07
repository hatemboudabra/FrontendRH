import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Notifications } from '../../data/notif';

@Injectable({
  providedIn: 'root',
})
export class NotificationApiService {
  private readonly apiUrl = 'http://localhost:8082';

  constructor(private http: HttpClient) {}

 getActiveNotificationsForUser(userId: number): Observable<Notifications[]> {
    return this.http.get<Notifications[]>(`${this.apiUrl}/notifications/${userId}`);
  } 
}