export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface ErrorBody {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  description: string;
}
