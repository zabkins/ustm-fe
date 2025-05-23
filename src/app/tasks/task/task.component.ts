import {Component, EventEmitter, inject, Input, OnInit, Output, Renderer2} from '@angular/core';
import {NgClass, NgStyle} from "@angular/common";
import {FormsModule} from "@angular/forms";
import {animate, state, style, transition, trigger} from "@angular/animations";
import {SubtaskComponent} from "../subtask/subtask.component";
import {Task} from "../tasks.models";
import {TasksService} from "../../dashboard/tasks.service";

@Component({
  selector: 'app-task',
  standalone: true,
  imports: [
    NgClass,
    FormsModule,
    NgStyle,
    SubtaskComponent
  ],
  templateUrl: './task.component.html',
  styleUrl: './task.component.css',
  animations: [
    trigger('rollout', [
      state(
        'hidden',
        style({
          height: '0',
          opacity: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'visible',
        style({
          height: '*',
          opacity: '1',
          overflow: 'hidden',
        })
      ),
      transition('hidden <=> visible', [
        animate('0.4s ease-in-out'),
      ]),
    ]),
    trigger('round-button', [
      state(
        'unrounded',
        style({
          'border-bottom-right-radius': '0',
        })
      ),
      state(
        'rounded',
        style({
          'border-bottom-right-radius': '0.6rem',
        })
      ),
      transition('unrounded => rounded', [
        animate('0.5s ease-in'),
      ]),
      transition('rounded => unrounded', [
        animate('0.2s ease-out'),
      ])
    ])
  ]
})
export class TaskComponent implements OnInit {
  @Input({required: true}) task!: Task;
  @Input({required: true}) selectedTask!: Task | null;
  @Output() taskSelectedForEdit = new EventEmitter<Task>();
  tasksService = inject(TasksService);
  subtasksVisible = false;
  isBeingEdited = false;

  ngOnInit(): void {
    this.tasksService.taskFormDiscarded.subscribe(() => {
      this.isBeingEdited = false;
    })
  }

  toggleSubtasks() {
    this.subtasksVisible = !this.subtasksVisible;
  }


  toggleEdit() {
    this.isBeingEdited = !this.isBeingEdited;
    this.taskSelectedForEdit.emit(this.task);
  }

  isEditButtonEnabled() {
    return ((this.selectedTask === null || this.selectedTask!.id === this.task.id))
      && !this.tasksService.taskInAddition();
  }
}
