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