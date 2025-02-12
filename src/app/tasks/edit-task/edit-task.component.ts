import {Component, inject, Input, OnInit, signal} from '@angular/core';
import {Task} from "../tasks.models";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EditSubtaskComponent} from "../edit-subtask/edit-subtask.component";
import {DatesService} from "../dates.service";
import {TasksService} from "../../dashboard/tasks.service";
import {finishDateBeforeStartDate, isFormValid, finishDateNotInPast} from "../form.validators";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-edit-task',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    EditSubtaskComponent,
    NgClass
  ],
  templateUrl: './edit-task.component.html',
  styleUrl: './edit-task.component.css'
})
export class EditTaskComponent implements OnInit {
  @Input({required: true}) task!: Task;
  formErrors = signal<string[]>([]);
  protected formInvalid = false;
  subTaskBeingAdded = false;
  datesService = inject(DatesService);
  tasksService = inject(TasksService);

  form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1)]),
      description: new FormControl('', [Validators.required, Validators.minLength(1)]),
      startDate: new FormControl('', Validators.required),
      finishDate: new FormControl('', [Validators.required, finishDateNotInPast()]),
      status: new FormControl<'' | 'IN_PROGRESS' | 'DONE' | 'CANCELLED' | 'PLANNED'>('', Validators.required),
    },
    {
      validators: [finishDateBeforeStartDate()]
    })

  ngOnInit() {
    if (this.task) {
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
    this.formErrors.set(isFormValid(this.form));
    if (this.formErrors().length === 0) {
      this.tasksService.updateTask(this.task.id, {
        name: this.form.value.name!,
        description: this.form.value.description!,
        startDate: this.datesService.getApiFormattedDate(this.form.value.startDate!),
        finishDate: this.datesService.getApiFormattedDate(this.form.value.finishDate!),
        status: this.task.status!,
      });
      this.formInvalid = false;
    } else {
      this.form.markAllAsTouched();
      this.formInvalid = true;
    }
  }

  isFieldInvalid(fieldName: string) {
    let field = this.form.get(fieldName)!;
    return field.invalid && field.touched;
  }

  onDiscard() {
    this.tasksService.discardTaskForm();
  }

  onSubtaskAdd() {
    this.subTaskBeingAdded = true;
    this.tasksService.addSubtask(this.task.id);
  }
}
