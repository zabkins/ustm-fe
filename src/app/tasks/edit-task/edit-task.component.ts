import {Component, inject, Input, OnInit} from '@angular/core';
import {Task} from "../tasks.models";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EditSubtaskComponent} from "../edit-subtask/edit-subtask.component";
import {DatesService} from "../dates.service";
import {TasksService} from "../../dashboard/tasks.service";

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditSubtaskComponent
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent implements OnInit{
  @Input({required: true}) task!: Task;
  subTaskBeingAdded = false;
  datesService = inject(DatesService);
  tasksService = inject(TasksService);

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    startDate: new FormControl('', Validators.required),
    finishDate: new FormControl('', Validators.required),
    status: new FormControl<'' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' | 'PLANNED'>('', Validators.required),
  })

  ngOnInit() {
    if(this.task) {
      this.form.patchValue({
        name: this.task.name,
        description: this.task.description,
        startDate: this.datesService.formatToDatetimeLocal(this.task.startDate),
        finishDate: this.datesService.formatToDatetimeLocal(this.task.finishDate),
        status: this.task.status,
      });
    }
  }

  onSubmit() {
    this.tasksService.updateTask(this.task.id, {
      name: this.form.value.name!,
      description: this.form.value.description!,
      startDate: this.datesService.getApiFormattedDate(this.form.value.startDate!),
      finishDate: this.datesService.getApiFormattedDate(this.form.value.finishDate!),
      status: this.task.status!,
    });
  }

  onDiscard() {
    this.tasksService.discardTaskForm();
  }

  onSubtaskAdd() {
    this.subTaskBeingAdded = true;
    // TODO
  }
}
