import {Component, inject} from '@angular/core';
import {TaskComponent} from "../task/task.component";
import {TasksService} from "../../dashboard/tasks.service";

@Component({
  selector: 'app-edit-task-area',
  standalone: true,
  imports: [TaskComponent],
  templateUrl: './action-area.component.html',
  styleUrl: './action-area.component.css'
})
export class ActionAreaComponent {
  tasksService = inject(TasksService);
  task = this.tasksService.taskInEdit;
}
