export class User {
  id!: number;
  username?: string;
  email?: string;
  password?: string;
  roles?: string[];
  noteGlobale?: number;
  demandes?: any[];
  taches?: any[];
  formations?: any[];
  reclamations?: any[];
  evaluations?: any[];
 // post:string;
}


export interface LoginDTO {
  username: string;
  password: string;
}

export interface UserDTO {
  username: string;
  email: string;
  password: string;
  roles?: string[];
}
