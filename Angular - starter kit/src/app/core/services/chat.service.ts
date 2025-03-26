import { Injectable } from "@angular/core";
import { BehaviorSubject, Observable } from "rxjs";
import { Client, IStompSocket } from '@stomp/stompjs';
import SockJS from 'sockjs-client';
import { ChatMessageDTO } from "../../data/chat";

@Injectable({ providedIn: 'root' })
export class ChatService {
    private stompClient: Client;
    private messageSubject: BehaviorSubject<ChatMessageDTO> = new BehaviorSubject<ChatMessageDTO>({} as ChatMessageDTO);
    private isConnected: boolean = false;
    private teamId: string = '1';
    constructor() {
        this.stompClient = new Client({
            webSocketFactory: () => new SockJS('http://localhost:9092/ws-chat')
        });
        this.connect(this.teamId);
    }

    connect(teamId: string): void {
        this.stompClient.onConnect = (frame) => {
          console.log('WebSocket connected:', frame);
          this.isConnected = true;
      
          this.stompClient.subscribe(`/topic/team/${teamId}`, (message) => {
            console.log('Received team message:', message.body);
            const newMessage: ChatMessageDTO = JSON.parse(message.body);
            this.messageSubject.next(newMessage);
          });
      
          this.stompClient.subscribe('/user/queue/private', (message) => {
            console.log('Received private message:', message.body);
            const newMessage: ChatMessageDTO = JSON.parse(message.body);
            this.messageSubject.next(newMessage);
          });
        };
      
        this.stompClient.onStompError = (error) => {
          console.error('WebSocket STOMP error:', error);
          this.isConnected = false;
          setTimeout(() => this.connect(teamId), 1000); 
        };
      
        this.stompClient.onWebSocketClose = (event) => {
          console.log('WebSocket closed:', event);
          this.isConnected = false;
          setTimeout(() => this.connect(teamId), 1000);
        };
      
        this.stompClient.onWebSocketError = (event) => {
          console.error('WebSocket error:', event);
          this.isConnected = false;
          setTimeout(() => this.connect(teamId), 1000); 
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
            console.error('WebSocket is not connected. Retrying in 1 second...');
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
            console.error('WebSocket is not connected.');
        }
    }

    getMessages(): Observable<ChatMessageDTO> {
        return this.messageSubject.asObservable();
    }
}