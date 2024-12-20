import {inject, Injectable, signal} from "@angular/core";
import {LoginRequest, LoginResponse, RegisterRequest, RegisterResponse, UserInformation} from "./login/auth.models";
import {HttpClient, HttpHeaders} from "@angular/common/http";
import {firstValueFrom} from "rxjs";

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

  fetchUserInfo(){
    return this.httpClient.get<UserInformation>('http://localhost:8080/users/me');
  }

  getRefreshTokenRequest() {
    return firstValueFrom(this.httpClient.post<LoginResponse>('http://localhost:8080/auth/refresh', {
      headers: {
        'Authorization': `Bearer ${this.currentlySignedUserToken()}`
      }
    }));
  }

  loginUser(response: LoginResponse) {
    this.currentlySignedUserToken.set(response.token);
  }

  logout() {
    this.currentlySignedUserToken.set(null);
  }
}
