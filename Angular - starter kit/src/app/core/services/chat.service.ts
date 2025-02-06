import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { ChatRoom } from "../../data/chat-room.model";
import { ChatMessage } from "../../data/chat-message.model";

@Injectable({ providedIn: 'root' })

export class ChatService {
    private baseUrl = 'http://localhost:8082/';
    constructor(private http: HttpClient) {}
    // creation chat private
    createPrivateChat(user1Id: number, user2Id: number): Observable<ChatRoom> {
      return this.http.post<ChatRoom>(`${this.baseUrl}/room/private`, null, {
        params: { user1Id: user1Id.toString(), user2Id: user2Id.toString() },
      });
    }
    getUserPrivateChats(userId: number): Observable<ChatRoom[]> {
      return this.http.get<ChatRoom[]>(`${this.baseUrl}/user/${userId}/private-chats`);
    }
    // create chat for team
    createTeamChatRoom(teamId: number): Observable<ChatRoom> {
      return this.http.post<ChatRoom>(`${this.baseUrl}/room/team`, { teamId });
    }
    // get messages d 'une sale
    getRoomMessages(roomId: number): Observable<ChatMessage[]> {
      return this.http.get<ChatMessage[]>(`${this.baseUrl}/room/${roomId}/messages`);
    }
    // send des messages 
    sendMessage(content: string, senderId: number, chatRoomId: number): Observable<ChatMessage> {
      const message = { content, senderId, chatRoomId };
      return this.http.post<ChatMessage>(`${this.baseUrl}/chat.message`, message);
    }
    // get messages non read 
    getUnreadMessages(roomId: number, userId: number): Observable<ChatMessage[]> {
      return this.http.get<ChatMessage[]>(`${this.baseUrl}/room/${roomId}/unread`, {
        params: { userId: userId.toString() },
      });
    }
  
}