import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })

export class ChatService {
    private baseUrl = 'http://localhost:8082/api/chat';
    constructor(private http: HttpClient) {}

    sendMessage(roomId: string, message: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/chat.sendMessage/${roomId}`, message);
    }
  
    joinRoom(roomId: string, message: any): Observable<any> {
      return this.http.post(`${this.baseUrl}/chat.join/${roomId}`, message);
    }
  
    getRoomMessages(teamId: number): Observable<any[]> {
      return this.http.get<any[]>(`${this.baseUrl}/rooms/${teamId}/messages`);
    }
    
}