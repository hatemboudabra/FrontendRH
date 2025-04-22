export interface Notifications {
  id?: number;
  userId: number;
  type: string; 
  message: string;
  createdAt?: Date;
  deleted?: boolean;
  
}