export interface ChatMessageDTO {
  sender: string;       
  chatRoomId: string;     
  content: string;
  type: 'PRIVATE' | 'TEAM';
  timestamp: string;
  senderUsername?: string;
  senderTeamName?: string;
}