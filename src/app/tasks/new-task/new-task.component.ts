import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EditSubtaskComponent} from "../edit-subtask/edit-subtask.component";
import {DatesService} from "../dates.service";
import {TasksService} from "../../dashboard/tasks.service";

@Component({
  selector: 'app-new-task',
  standalone: true,
  imports: [
    EditSubtaskComponent,
    ReactiveFormsModule
  ],
  templateUrl: './new-task.component.html',
  styleUrl: './new-task.component.css'
})
export class NewTaskComponent {
  datesService = inject(DatesService);
  tasksService = inject(TasksService);

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    startDate: new FormControl(
      this.datesService.getInitialFormStartAndFinishDatetime().startDate,
      Validators.required),
    finishDate: new FormControl(
      this.datesService.getInitialFormStartAndFinishDatetime().endDate,
      Validators.required),
  });

  onSubmit() {
    let newTask = {
      name: this.form.value.name!,
      description: this.form.value.description!,
      startDate: this.datesService.getApiFormattedDate(this.form.value.startDate!),
      finishDate: this.datesService.getApiFormattedDate(this.form.value.finishDate!),
    };
    console.log(newTask)
    this.tasksService.saveNewTask(newTask);
  }

  onDiscard() {
    this.tasksService.discardTaskForm();
  }
}
