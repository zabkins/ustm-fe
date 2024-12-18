import {inject, Injectable, signal} from "@angular/core";
import {LoginRequest, LoginResponse} from "./login/auth.models";
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

  loginUser(response: LoginResponse) {
    this.currentlySignedUserToken.set(response.token);
  }
}
