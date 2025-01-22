export interface ChatMessage {
    id?: number;
    sender: {
      username: string;
    };
    content: string;
    timestamp?: string;
    messageType: 'CHAT' | 'JOIN' | 'LEAVE';
  }
  