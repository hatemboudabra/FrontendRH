export interface ChatMessageDTO {
  sender: string;
  content: string;
  chatRoomId: string | null;
  type: 'PRIVATE' | 'TEAM';
  recipientId: string | null;
  timestamp: string;
  senderUsername?: string;
  senderTeamName?: string;
}