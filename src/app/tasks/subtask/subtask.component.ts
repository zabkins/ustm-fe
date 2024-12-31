import { Component, Input } from '@angular/core';
import {SubTask} from "../tasks.models";

@Component({
  selector: 'app-subtask',
  standalone: true,
  imports: [],
  templateUrl: './subtask.component.html',
  styleUrl: './subtask.component.css'
})
export class SubtaskComponent {
  @Input({required: true}) subTask!: SubTask;
}
