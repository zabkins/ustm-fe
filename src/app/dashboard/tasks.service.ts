import {inject, Injectable, signal} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {NewTask, Page, Task} from "../tasks/tasks.models";
import {ErrorBody} from "../auth/login/auth.models";

@Injectable({providedIn: 'root'})
export class TasksService {
  tasks = signal<Task[]>([]);
  taskInEdit = signal<Task | null>(null);
  taskInAddition = signal<boolean>(false);
  private httpClient = inject(HttpClient);


  fetchUserTasks() {
    return this.httpClient.get<Page>('http://localhost:8080/tasks').subscribe({
      next: response => {
        this.tasks.set(response.content);
        console.log(response);
      },
      error: (error: HttpErrorResponse) => {
        let errorBody: ErrorBody = error.error;
        console.log(errorBody);
      }
    });
  }

  toggleTaskForEdit(task: Task) {
    if(this.taskInEdit() && this.taskInEdit()?.id === task.id) {
      this.taskInEdit.set(null);
    } else {
      this.taskInAddition.set(false);
      this.taskInEdit.set(task);
    }
  }

  enableAddingNewTask() {
    this.taskInEdit.set(null);
    this.taskInAddition.set(true);
  }
}
