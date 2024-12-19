export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  expiresIn: number;
}

export interface RegisterRequest {
  email: string;
  password: string;
  fullName: string;
}

export interface RegisterResponse {
  id: number;
  fullName: string;
  email: string;
  createdAt: string;
  updatedAt: string;
}

export interface ErrorBody {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  description: string;
}
