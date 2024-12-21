import {HttpInterceptorFn} from "@angular/common/http";
import {inject} from "@angular/core";
import {AuthService} from "./auth.service";

export const authInterceptorFn: HttpInterceptorFn = (request, next) => {
  let authService = inject(AuthService);
  let userToken = authService.currentlySignedUserToken();
  let validPath = ['/auth/signup', '/auth/login', '/auth/refresh'].some(path => !request.url.includes(path));

  if (userToken && validPath && !isTokenExpired(userToken)) {
    request = request.clone({
      setHeaders: {
        Authorization: `Bearer ${userToken}`
      }
    });
  }
  authService.latestRequestTimestamp.set(Date.now())
  return next(request);
}

function isTokenExpired(userToken: string) {
  try {
    const payload = JSON.parse(atob(userToken.split('.')[1]));
    const expirationDate = payload.exp * 1000; // convert to milliseconds
    return new Date().getTime() > expirationDate;
  } catch (e) {
    return true; // If the token is malformed, treat it as expired
  }
}
