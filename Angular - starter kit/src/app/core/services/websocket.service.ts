import { Injectable } from "@angular/core";
import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { NotificationService } from "./notification.service";
import { Notifications } from "../../data/notif";

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient!: Stomp.Client;
  private userId?: number;

  constructor(private notificationService: NotificationService) {}

  public connect(userId: number): void {
    this.userId = userId;
    
    if (this.stompClient?.connected) {
      return;
    }

    const socket = new SockJS('http://localhost:8082/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, (frame) => {
      console.log('Connected: ' + frame);

      this.stompClient.subscribe(`/user/queue/notifications`, (notification) => {
        const parsedNotification: Notifications = JSON.parse(notification.body);
        
        if (parsedNotification.userId === this.userId) {
          console.log('Notification reçue :', parsedNotification);
          this.notificationService.addNotification(parsedNotification);
        }
      });
    });
  }
}