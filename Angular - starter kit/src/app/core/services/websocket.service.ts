import { Injectable } from "@angular/core";
import SockJS from 'sockjs-client';
import * as StompJs from '@stomp/stompjs';
import { Client, Frame, IMessage } from '@stomp/stompjs';
import { NotificationService } from "./notification.service";
import { Notifications } from "../../data/notif";
import { AuthenticationService } from "./auth.service";
import { BehaviorSubject } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class WebsocketService {
  private stompClient!: Client;
  private userId?: number;
  private connectionStatus = new BehaviorSubject<string>('disconnected');
  connectionStatus$ = this.connectionStatus.asObservable();

  constructor(private notificationService: NotificationService, private authService: AuthenticationService) {}
  
  public setUserId(userId: number): void {
    console.log(`[WebSocket] UserId défini à: ${userId}`);
    this.userId = userId;
  }

  public connect(): void {
    console.log(`[WebSocket] Tentative de connexion pour l'utilisateur ${this.userId}`);
 
    if (!this.userId) {
      console.error("[WebSocket] Erreur: Impossible de se connecter aux WebSockets - Utilisateur non identifié");
      this.connectionStatus.next('error');
      return;
    }
 
    if (this.stompClient?.connected) {
      console.log("[WebSocket] Déjà connecté, aucune action nécessaire");
      this.connectionStatus.next('connected');
      return;
    }
    
    console.log("[WebSocket] Création d'une nouvelle connexion SockJS");
    try {
      const socket = new SockJS('http://localhost:9093/ws');
      
      console.log("[WebSocket] Configuration du client STOMP");
      this.stompClient = new StompJs.Client({
        webSocketFactory: () => socket,
        debug: (msg: string) => console.log(`[STOMP Debug] ${msg}`),
        reconnectDelay: 5000,
        heartbeatIncoming: 4000,
        heartbeatOutgoing: 4000,
      });
      
      this.stompClient.onConnect = (frame: Frame) => {
        console.log(`[WebSocket] Connecté avec succès:`, frame);
        this.connectionStatus.next('connected');
        
        const destination = `/user/${this.userId}/queue/notifications`;
        console.log(`[WebSocket] Abonnement à la destination: ${destination}`);
        
        try {
          const subscription = this.stompClient.subscribe(destination, 
            (message: IMessage) => {
              console.log(`[WebSocket] Message brut reçu:`, message);
              
              try {
                const parsedNotification: Notifications = JSON.parse(message.body);
                console.log('[WebSocket] Notification parsée avec succès:', parsedNotification);
                this.notificationService.addNotification(parsedNotification);
              } catch (parseError) {
                console.error('[WebSocket] Erreur de parsing JSON:', parseError);
                console.log('[WebSocket] Contenu du message brut:', message.body);
              }
            },
            { id: `user-${this.userId}-notifications` }
          );
          
          console.log(`[WebSocket] Abonnement créé avec ID: ${subscription.id}`);
        } catch (subError) {
          console.error('[WebSocket] Erreur lors de l\'abonnement:', subError);
        }
      };
      
      this.stompClient.onStompError = (frame) => {
        console.error('[WebSocket] Erreur STOMP:', frame);
        this.connectionStatus.next('error');
      };
      
      this.stompClient.onWebSocketError = (event) => {
        console.error('[WebSocket] Erreur WebSocket:', event);
        this.connectionStatus.next('error');
      };
      
      this.stompClient.onDisconnect = (frame) => {
        console.log('[WebSocket] Déconnecté:', frame);
        this.connectionStatus.next('disconnected');
      };
      
      console.log("[WebSocket] Activation de la connexion...");
      this.stompClient.activate();
      
    } catch (error) {
      console.error("[WebSocket] Erreur critique lors de l'initialisation:", error);
      this.connectionStatus.next('error');
    }
  }
  
  public disconnect(): void {
    console.log("[WebSocket] Demande de déconnexion");
    if (this.stompClient?.connected) {
      this.stompClient.deactivate();
    }
  }
  
  public isConnected(): boolean {
    return this.stompClient?.connected || false;
  }
  
  public getConnectionStatus(): string {
    return this.connectionStatus.getValue();
  }
  
 
}