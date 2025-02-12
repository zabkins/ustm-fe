import {Component, inject, signal} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EditSubtaskComponent} from "../edit-subtask/edit-subtask.component";
import {DatesService} from "../dates.service";
import {TasksService} from "../../dashboard/tasks.service";
import {NgClass} from "@angular/common";
import {finishDateBeforeStartDate, isFormValid, finishDateNotInPast} from "../form.validators";

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [
    EditSubtaskComponent,
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
  formErrors = signal<string[]>([]);
  protected formInvalid = false;
  datesService = inject(DatesService);
  tasksService = inject(TasksService);

  form = new FormGroup({
      name: new FormControl('', [Validators.required, Validators.minLength(1)]),
      description: new FormControl('', [Validators.required, Validators.minLength(1)]),
      startDate: new FormControl(
        this.datesService.getInitialFormStartAndFinishDatetime().startDate,
        Validators.required),
      finishDate: new FormControl(
        this.datesService.getInitialFormStartAndFinishDatetime().endDate,
        [Validators.required,finishDateNotInPast()]),
    },
    {
      validators: [finishDateBeforeStartDate()]
    });

  onSubmit() {
    this.formErrors.set(isFormValid(this.form));
    if (this.formErrors().length === 0) {
      let newTask = {
        name: this.form.value.name!,
        description: this.form.value.description!,
        startDate: this.datesService.getApiFormattedDate(this.form.value.startDate!),
        finishDate: this.datesService.getApiFormattedDate(this.form.value.finishDate!),
      };
      this.tasksService.saveNewTask(newTask);
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
}
