import {EventEmitter, inject, Injectable, Output, signal} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {NewTask, Page, Task} from "../tasks/tasks.models";
import {ErrorBody} from "../auth/login/auth.models";
import {Router} from "@angular/router";

@Injectable({providedIn: 'root'})
export class TasksService {
  tasks = signal<Task[]>([]);
  taskInEdit = signal<Task | null>(null);
  taskInAddition = signal<boolean>(false);
  @Output() taskFormDiscarded = new EventEmitter();
  private httpClient = inject(HttpClient);
  private router = inject(Router);


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

  saveNewTask(newTask: NewTask) {
    this.httpClient.post<Task>('http://localhost:8080/tasks', newTask).subscribe({
      next: response => {
        this.tasks.update(array => [response, ...array]);
        this.taskInAddition.set(false);
        this.taskInEdit.set(response);
        this.router.navigate(['/'], {replaceUrl: true})
      },
      error: (error: HttpErrorResponse) => {
        let errorBody: ErrorBody = error.error;
        console.log(errorBody);
      }
    });

  }

  toggleTaskForEdit(task: Task) {
    if (this.taskInEdit() && this.taskInEdit()?.id === task.id) {
      this.taskInEdit.set(null);
    } else {
      this.taskInAddition.set(false);
      this.taskInEdit.set(task);
    }
  }

  enableAddingNewTask() {
    this.taskInEdit.set(null);
    this.taskFormDiscarded.emit();
    this.taskInAddition.set(true);
  }

  discardTaskForm() {
    if (this.taskInEdit()) {
      this.taskInEdit.set(null);
    }
    if (this.taskInAddition()) {
      this.taskInAddition.set(false);
    }
    this.taskFormDiscarded.emit();
    this.router.navigate(['/'], {replaceUrl: true});
  }

  updateTask(
    taskId: number,
    taskProperties: {
      name: string;
      description: string;
      finishDate: string | "Invalid DateTime";
      startDate: string | "Invalid DateTime";
      status: "PLANNED" | "IN_PROGRESS" | "DONE" | "CANCELLED"
    }) {
    this.httpClient.put<Task>(`http://localhost:8080/tasks/${taskId}`, taskProperties).subscribe({
      next: response => {
        this.taskInEdit.set(response);
        this.tasks.set(this.tasks().map(task => task.id === response.id ? response : task));
        this.router.navigate(['/'], {replaceUrl: true});
      },
      error: (error: HttpErrorResponse) => {
        let errorBody: ErrorBody = error.error;
        console.log(errorBody);
      }
    })
  }
}
