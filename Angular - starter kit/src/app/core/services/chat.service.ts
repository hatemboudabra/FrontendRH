import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Client, IStompSocket, StompSubscription } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessageDTO } from "../../data/chat";

@Injectable({ providedIn: 'root' })
export class ChatService {
  private stompClient: Client;
  private messageSubject: BehaviorSubject<ChatMessageDTO> = new BehaviorSubject<ChatMessageDTO>({} as ChatMessageDTO);
  private isConnected: boolean = false;
  private teamSubscription?: StompSubscription;
  private privateSubscription?: StompSubscription;
  constructor() {
    this.stompClient = new Client({
      webSocketFactory: () => new SockJS('http://localhost:9092/ws-chat'),
      reconnectDelay: 1000 
    });
  }

  connect(teamId: string): void {
    if (this.stompClient.active) {
      this.stompClient.deactivate();
    }

    this.stompClient.onConnect = (frame) => {
      if (this.teamSubscription) {
        this.teamSubscription.unsubscribe();
      }
      if (this.privateSubscription) {
        this.privateSubscription.unsubscribe();
      }
      console.log('WebSocket connecté:', frame);
      this.isConnected = true;

      this.teamSubscription = this.stompClient.subscribe(
        `/topic/team/${teamId}`, 
        (message) => {
          const newMessage: ChatMessageDTO = JSON.parse(message.body);
          this.messageSubject.next(newMessage);
        }
      );

      this.privateSubscription = this.stompClient.subscribe(
        '/user/queue/private',
        (message) => {
          const newMessage: ChatMessageDTO = JSON.parse(message.body);
          this.messageSubject.next(newMessage);
        }
      );
    };

    this.stompClient.onStompError = (error) => {
      console.error('Erreur STOMP:', error);
     // this.isConnected = false;
    //  setTimeout(() => this.connect(teamId), 1000);
    };

    
    this.stompClient.activate();
  }

  sendTeamMessage(teamId: string, message: ChatMessageDTO): void {
    if (this.isConnected) {
      this.stompClient.publish({
        destination: `/app/chat/team/${teamId}`,
        body: JSON.stringify(message)
      });
    } else {
      console.error('WebSocket non connecté. Nouvelle tentative dans 1 seconde...');
      setTimeout(() => this.sendTeamMessage(teamId, message), 1000);
    }
  }

  sendPrivateMessage(userId: string, message: ChatMessageDTO): void {
    if (this.isConnected) {
      this.stompClient.publish({
        destination: `/app/chat/private/${userId}`,
        body: JSON.stringify(message)
      });
    } else {
      console.error('WebSocket non connecté. Nouvelle tentative dans 1 seconde...');
      setTimeout(() => this.sendPrivateMessage(userId, message), 1000);
    }
  }
  
  

  getMessages(): Observable<ChatMessageDTO> {
    return this.messageSubject.asObservable();
  }
}
