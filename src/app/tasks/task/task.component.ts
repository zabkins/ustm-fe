import { Component } from '@angular/core';

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css'
})
export class TaskComponent {
  subtasksVisible = false;

  toggleSubtasks() {
    this.subtasksVisible = !this.subtasksVisible;
  }
}
