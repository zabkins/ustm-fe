import {Component, Input, OnChanges, OnInit, SimpleChanges} from '@angular/core';
import {Task} from "../tasks.models";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {DateTime} from "luxon";
import {EditSubtaskComponent} from "../edit-subtask/edit-subtask.component";

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
        startDate: this.formatToDatetimeLocal(this.task.startDate),
        finishDate: this.formatToDatetimeLocal(this.task.finishDate),
        status: this.task.status,
      });
    }
  }

  onSubmit() {
  }

  private formatToDatetimeLocal(dateString: string): string {
    const timeZoneMap: { [key: string]: string } = {
      CET: 'Europe/Paris',
      CEST: 'Europe/Paris',
    };

    const [datePart, timePart, timeZone] = dateString.split(' ');

    const fullDateString = `${datePart} ${timePart}`;
    const ianaTimeZone = timeZoneMap[timeZone] || 'UTC';

    const parsedDate = DateTime.fromFormat(fullDateString, 'dd/MM/yyyy HH:mm:ss', {zone: ianaTimeZone});
    return parsedDate.toFormat('yyyy-MM-dd\'T\'HH:mm'); // Format for datetime-local
  }
}
