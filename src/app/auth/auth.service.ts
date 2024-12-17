import {Injectable, signal} from "@angular/core";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  currentlySignedUserToken = signal<string | null>(null);
}
