import {Component, computed, inject, OnInit, signal} from '@angular/core';
import {Router, RouterLink} from "@angular/router";
import {AuthService} from "../auth/auth.service";
import {TasksService} from "./tasks.service";
import {TaskComponent} from "../tasks/task/task.component";
import {ActionAreaComponent} from "../tasks/action-area/action-area.component";
import {Task} from "../tasks/tasks.models";

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [
    RouterLink,
    TaskComponent,
    ActionAreaComponent
  ],
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.css'
})
export class DashboardComponent implements OnInit {
  private router = inject(Router);
  private authService = inject(AuthService);
  protected tasksService = inject(TasksService);

  private selectedFilter = signal<string>('all');
  dropdownVisible = false;
  userInfo = this.authService.user;
  userTasks = computed(() => {
    switch (this.selectedFilter()) {
      case 'PLANNED':
        return this.tasksService.tasks().filter(task => task.status === 'PLANNED');
      case 'DONE':
        return this.tasksService.tasks().filter(task => task.status === 'DONE');
      case 'IN_PROGRESS':
        return this.tasksService.tasks().filter(task => task.status === 'IN_PROGRESS');
      case 'CANCELLED':
        return this.tasksService.tasks().filter(task => task.status === 'CANCELLED');
      default:
        return this.tasksService.tasks();
    }
  })

  ngOnInit(): void {
    this.authService.fetchUserInfo();
    this.tasksService.fetchUserTasks();
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

  onTaskSelected(task: Task) {
    this.tasksService.toggleTaskForEdit(task);
  }
}
