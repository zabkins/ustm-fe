import {Component, inject, OnInit, signal} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {ErrorBody, UserInformation} from "../auth/login/auth.models";
import {DashboardService} from "./dashboard.service";
import {HttpErrorResponse} from "@angular/common/http";
import { Task } from '../tasks/tasks.models';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  private dashboardService = inject(DashboardService);
  userInfo = signal<UserInformation | null>(null);
  private userTasks = signal<Task[]>([]);
  dropdownVisible = false;

  ngOnInit(): void {
    this.authService.fetchUserInfo().subscribe({
      next: response => {
        this.userInfo.set(response);
        console.log(response);
      },
      error: error => {
        console.log(error);
      }
    });
    this.dashboardService.fetchUserTasks().subscribe({
      next: response => {
        this.userTasks.set(response.content);
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        let errorBody: ErrorBody = error.error;
        console.log(errorBody);
      }
    });
  }

  logout() {
    this.authService.logout();
    this.router.navigate(['login'], {
      replaceUrl: true
    });
  }

  toggleDropdown() {
    this.dropdownVisible = !this.dropdownVisible;
  }
}
