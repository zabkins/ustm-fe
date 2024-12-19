import {inject, Injectable, signal} from "@angular/core";
import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse} from "./login/auth.models";
import {HttpClient} from "@angular/common/http";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private httpClient = inject(HttpClient);
  currentlySignedUserToken = signal<string | null>(null);

  getLoginRequest(loginRequest: LoginRequest) {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/auth/login', loginRequest);
  }

  getRegisterRequest(registerRequest: RegisterRequest) {
    return this.httpClient.post<RegisterResponse>('http://localhost:8080/auth/signup', registerRequest);
  }

  loginUser(response: LoginResponse) {
    this.currentlySignedUserToken.set(response.token);
  }
}
