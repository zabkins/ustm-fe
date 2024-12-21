import {Component, inject, OnInit, signal} from '@angular/core';
import {Router} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {UserInformation} from "../auth/login/auth.models";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  userInfo = signal<UserInformation | null>(null);

  ngOnInit(): void {
    this.authService.fetchUserInfo().subscribe({
      next: response => {
        this.userInfo.set(response);
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }

  temp() {
    console.log('Current TOKEN: ', this.authService.currentlySignedUserToken());
    this.authService.fetchUserInfo().subscribe({
      next: response => {
        this.userInfo.set(response);
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    })
  }
}
