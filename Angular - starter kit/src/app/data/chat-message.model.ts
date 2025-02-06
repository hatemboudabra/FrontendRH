export interface ChatMessage {
  id: number; 
  content: string; 
  timestamp: string; 
  senderId: number; 
  senderName: string;
  chatRoomId: number; 
  isRead: boolean; 
}