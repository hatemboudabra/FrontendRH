export interface Notifications {
  id?: number;
  message: string;
  type: 'success' | 'error' | 'info';
  userId: number;
  createdAt?: Date;
  }