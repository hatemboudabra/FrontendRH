import { Injectable } from "@angular/core";
import { Client, over } from 'stompjs';
import SockJS from 'sockjs-client';
import * as Stomp from 'stompjs';
import { NotificationService } from "./notification.service";

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient!: Stomp.Client;

  constructor(private notificationService: NotificationService) {
    this.connect();
  }

  connect() {
    const socket = new SockJS('http://localhost:8082/ws');
    this.stompClient = Stomp.over(socket);

    this.stompClient.connect({}, frame => {
      console.log('Connected: ' + frame);

      this.stompClient.subscribe('/user/queue/notifications', notification => {
        const parsedNotification = JSON.parse(notification.body);
        this.notificationService.addNotification(parsedNotification); 
      });
    });
  }
}