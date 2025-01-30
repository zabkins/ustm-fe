import {Component, inject} from '@angular/core';
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {EditSubtaskComponent} from "../edit-subtask/edit-subtask.component";
import {DatesService} from "../dates.service";

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

  form = new FormGroup({
    name: new FormControl('', Validators.required),
    description: new FormControl('', Validators.required),
    startDate: new FormControl(
      this.datesService.getCurrentDateInDatetimeLocalFormat().startDate,
      Validators.required),
    finishDate: new FormControl(
      this.datesService.getCurrentDateInDatetimeLocalFormat().endDate,
      Validators.required),
  });

  onSubmit() {
    console.log(this.form);
  }
}
