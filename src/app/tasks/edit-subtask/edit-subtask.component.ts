import {Component, Input, OnInit} from '@angular/core';
import {SubTask} from "../tasks.models";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";

@Component({
  selector: 'app-edit-subtask',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NgClass
  ],
  templateUrl: './edit-subtask.component.html',
  styleUrl: './edit-subtask.component.css'
})
export class EditSubtaskComponent implements OnInit{
  @Input({required: true}) subTask!: SubTask;
  form = new FormGroup({
    name: new FormControl('', [Validators.required]),
    description: new FormControl('', [Validators.required]),
    status: new FormControl<true | false>(false, [Validators.required])
  })

  ngOnInit(): void {
    if (this.subTask) {
      this.form.patchValue({
        name: this.subTask.name,
        description: this.subTask.description,
        status: this.subTask.done
      })
    }
  }

  onSubmit() {

  }

  isSubtaskDone() {
    return this.subTask.done;
  }
}
