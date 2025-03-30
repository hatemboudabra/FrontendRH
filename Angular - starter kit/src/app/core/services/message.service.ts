import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { ChatMessageDTO } from "../../data/chat";
import { catchError, Observable, of } from "rxjs";

@Injectable({ providedIn: 'root' })
export class MessagChatService {
    private baseUrl = 'http://localhost:9092';
    
    constructor(private http: HttpClient) {}

    getTeamMessages(teamId: number): Observable<ChatMessageDTO[]> {
        return this.http.get<ChatMessageDTO[]>(`${this.baseUrl}/team/${teamId}`).pipe(
            catchError(error => {
                console.error('Failed to fetch team messages:', error);
                return of([]);
            })
        );
    }
    getPrivateMessages(userId: number, recipientId: number): Observable<ChatMessageDTO[]> {
        console.log(`[MessagChatService] Fetching private messages between ${userId} and ${recipientId}`);
        return this.http.get<ChatMessageDTO[]>(`${this.baseUrl}/private/${userId}/${recipientId}`).pipe(
          catchError(error => {
            console.error('[MessagChatService] Failed to fetch private messages:', error);
            return of([]);
          })
        );
      }
      
}