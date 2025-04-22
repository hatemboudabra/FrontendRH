export interface ResetPasswordDTO {
    newPassword: string;
    confirmPassword: string;
  }
  
  export interface ForgotPasswordDTO {
    email: string;
  }