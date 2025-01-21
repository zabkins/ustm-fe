import {Component, Input} from '@angular/core';
import {Task} from "../tasks.models";

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent {
  @Input({required: true}) task!: Task;
}
