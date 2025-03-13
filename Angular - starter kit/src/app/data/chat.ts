export class ChatMessageDTO {
    sender: string; 
    content: string; 
    timestamp: string; 
    type: string; 
    senderUsername?: string; 
    senderTeamName?: string;
    chatRoomId?: string; 
  
    constructor(
      sender: string,
      content: string,
      timestamp: string,
      type: string,
      senderUsername?: string,
      senderTeamName?: string,
      chatRoomId?: string
    ) {
      this.sender = sender;
      this.content = content;
      this.timestamp = timestamp;
      this.type = type;
      this.senderUsername = senderUsername;
      this.senderTeamName = senderTeamName;
      this.chatRoomId = chatRoomId;
    }
  }