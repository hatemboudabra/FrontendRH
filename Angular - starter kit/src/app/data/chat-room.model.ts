export interface ChatRoom {
  id: number;
  name: string; 
  type: 'PRIVATE' | 'TEAM'; 
  teamId?: number;
  participantIds: number[];
  }
   
  