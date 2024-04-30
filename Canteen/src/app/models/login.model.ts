export interface Login {
  username: string;
  password: string;
}

export interface LoginResponse {
  isSuccess: boolean;
  message: string;
  data: {
    userToken: string;
    userRole: string; 
  };
}