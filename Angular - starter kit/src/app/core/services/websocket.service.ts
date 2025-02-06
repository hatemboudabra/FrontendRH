import { Injectable } from "@angular/core";
import { Client } from '@stomp/stompjs';
import { BehaviorSubject, Observable } from "rxjs";
import SockJS from 'sockjs-client';

@Injectable({
    providedIn: 'root',
  })
  export class WebsocketService {
    private stompClient: Client;
    private messageSubject = new BehaviorSubject<any>(null);
  
    constructor() {
      const socket = new SockJS('http://localhost:8082/ws'); // URL du backend
      this.stompClient = new Client({
        webSocketFactory: () => socket,
        onConnect: (frame) => {
          console.log('Connected: ' + frame);
        },
        onStompError: (error) => {
          console.error('Error: ' + error);
        },
      });
    }
    connect() {
        this.stompClient.activate();
      }
    
      subscribeToTopic(topic: string): Observable<any> {
        this.stompClient.subscribe(topic, (message) => {
          this.messageSubject.next(JSON.parse(message.body));
        });
        return this.messageSubject.asObservable();
      }
    
      sendMessage(destination: string, message: any) {
        this.stompClient.publish({
          destination,
          body: JSON.stringify(message),
        });
      }
    
      disconnect() {
        if (this.stompClient) {
          this.stompClient.deactivate();
        }
      }
  }