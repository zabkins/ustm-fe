import {DestroyRef, inject, Injectable, signal} from "@angular/core";
import {
  ErrorBody,
  LoginRequest,
  LoginResponse,
  RegisterRequest,
  RegisterResponse,
  UserInformation
} from "./login/auth.models";
import {HttpClient, HttpErrorResponse, HttpHeaders} from "@angular/common/http";
import {interval, Subscription, switchMap, takeUntil} from "rxjs";
import {takeUntilDestroyed} from "@angular/core/rxjs-interop";

@Injectable({
  providedIn: "root"
})
export class AuthService {
  private httpClient = inject(HttpClient);
  currentlySignedUserToken = signal<string | null>(null);
  refreshSubscription = signal<Subscription | null>(null);
  latestRequestTimestamp = signal<number | null>(null);

  constructor(private destroyRef: DestroyRef) {
    this.destroyRef.onDestroy(() => {
      this.refreshSubscription()?.unsubscribe();
      this.refreshSubscription.set(null);
      this.currentlySignedUserToken.set(null);
    })
  }

  getLoginRequest(loginRequest: LoginRequest) {
    return this.httpClient.post<LoginResponse>('http://localhost:8080/auth/login', loginRequest);
  }

  getRegisterRequest(registerRequest: RegisterRequest) {
    return this.httpClient.post<RegisterResponse>('http://localhost:8080/auth/signup', registerRequest);
  }

  fetchUserInfo(){
    return this.httpClient.get<UserInformation>('http://localhost:8080/users/me');
  }

  loginUser(response: LoginResponse) {
    this.currentlySignedUserToken.set(response.token);
    this.scheduleRefreshRequest();
  }

  logout() {
    this.currentlySignedUserToken.set(null);
    if (this.refreshSubscription()) {
      this.refreshSubscription()!.unsubscribe();
    }
  }

  scheduleRefreshRequest() {
    if (this.currentlySignedUserToken() && this.requestMadeInLastFiveMinutes()) {
      this.refreshSubscription.set(interval(55 * 60 * 1000)
        .pipe(
          switchMap(() => {
            if (this.currentlySignedUserToken() && this.requestMadeInLastFiveMinutes()) {
              return this.httpClient.post<LoginResponse>('http://localhost:8080/auth/refresh', {}, {
                headers: new HttpHeaders({
                  'Authorization': 'Bearer ' + this.currentlySignedUserToken()
                })
              });
            } else {
              throw new HttpErrorResponse({
                error: 'Refreshing TOKEN is not possible'
              });
            }
          }),
          takeUntilDestroyed(this.destroyRef)
        )
        .subscribe({
          next: response => {
            this.currentlySignedUserToken.set(response.token);
          },
          error: (error: HttpErrorResponse)  => {
            let errorBody: ErrorBody = error.error;
            console.log(errorBody);
          }
        }));
    }
  }

  private requestMadeInLastFiveMinutes() {
    if (!this.latestRequestTimestamp()) {
      return false;
    }
    return this.latestRequestTimestamp()! > (Date.now() - 5 * 60 * 1000);
  }
}
