import {Component, inject, signal} from '@angular/core';
import {AbstractControl, FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EditSubtaskComponent} from "../edit-subtask/edit-subtask.component";
import {DatesService} from "../dates.service";
import {TasksService} from "../../dashboard/tasks.service";
import {NgClass} from "@angular/common";

function startDateNotInPast() {
  return (control: AbstractControl) => {
    const startDate = control.value;
    if (startDate && new Date(startDate) < new Date()) {
      return {startDateInPast: true};
    }
    return null;
  };
}

function startDateBeforeFinishDate() {
  return (control: AbstractControl) => {
    const startDate = control.get('startDate')?.value;
    const finishDate = control.get('finishDate')?.value;
    if (startDate && finishDate && new Date(startDate) >= new Date(finishDate)) {
      return {startBeforeFinish: true};
    }
    return null;
  };
}

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
        [Validators.required, startDateNotInPast()]),
      finishDate: new FormControl(
        this.datesService.getInitialFormStartAndFinishDatetime().endDate,
        Validators.required),
    },
    {
      validators: [startDateBeforeFinishDate()]
    });

  onSubmit() {
    if (this.isFormValid()) {
      let newTask = {
        name: this.form.value.name!,
        description: this.form.value.description!,
        startDate: this.datesService.getApiFormattedDate(this.form.value.startDate!),
        finishDate: this.datesService.getApiFormattedDate(this.form.value.finishDate!),
      };
      this.tasksService.saveNewTask(newTask);
      this.formInvalid = false;
    } else {
      this.formInvalid = true;
    }
  }

  isFormValid() {
    let errors: string[] = [];
    if (this.form.get('name')?.hasError('required')) {
      errors.push('Name is required');
    }
    if (this.form.get('description')?.hasError('required')) {
      errors.push('Description is required');
    }
    if (this.form.get('startDate')?.hasError('required')) {
      errors.push('Start date is required');
    }
    if (this.form.get('startDate')?.hasError('startDateInPast')) {
      errors.push('Start date cannot be in the past');
    }
    if (this.form.get('finishDate')?.hasError('required')) {
      errors.push('End date is required');
    }
    if (this.form.hasError('startBeforeFinish')) {
      errors.push('Finish date cannot be earlier than start date');
    }
    this.form.markAllAsTouched();
    this.formErrors.set(errors);
    return this.formErrors().length === 0;
  }

  isFieldInvalid(fieldName: string) {
    let field = this.form.get(fieldName)!;
    return field.invalid && field.touched;
  }

  onDiscard() {
    this.tasksService.discardTaskForm();
  }
}
