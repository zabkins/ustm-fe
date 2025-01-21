import {Component, inject} from '@angular/core';
import {TaskComponent} from "../task/task.component";
import {TasksService} from "../../dashboard/tasks.service";
import {EditTaskComponent} from "../edit-task/edit-task.component";

@Component({
  selector: 'app-action-area',
  standalone: true,
  imports: [TaskComponent, EditTaskComponent],
  templateUrl: './action-area.component.html',
  styleUrl: './action-area.component.css'
})
export class ActionAreaComponent {
  tasksService = inject(TasksService);
  task = this.tasksService.taskInEdit;
}
