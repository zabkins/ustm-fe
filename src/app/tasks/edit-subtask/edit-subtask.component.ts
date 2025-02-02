import {Component, inject, Input, OnInit} from '@angular/core';
import {SubTask} from "../tasks.models";
import {FormControl, FormGroup, ReactiveFormsModule, Validators} from "@angular/forms";
import {NgClass} from "@angular/common";
import {TasksService} from "../../dashboard/tasks.service";

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
  private tasksService = inject(TasksService);
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

  isSubtaskDone() {
    return this.subTask.done;
  }

  onComplete() {
    this.tasksService.completeSubtask(this.subTask.id, {
      name: this.form.value.name!,
      description: this.form.value.description!,
      status: true
    });
  }

  onSave() {
    this.tasksService.updateSubtask(this.subTask.id, {
      name: this.form.value.name!,
      description: this.form.value.description!
    });
  }

  onDelete() {
    this.tasksService.deleteSubtask(this.subTask.id);
  }

  isFieldInvalid(fieldName: string, groupName?: string) {
    if (groupName) {
      let field = this.form.get(groupName + '.' + fieldName)!;
      return field.invalid && field.touched;
    } else {
      let field = this.form.get(fieldName)!;
      return field.invalid && field.touched;
    }
  }
}
