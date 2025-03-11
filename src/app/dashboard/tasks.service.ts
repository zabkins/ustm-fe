import {EventEmitter, inject, Injectable, Output, signal} from "@angular/core";
import {HttpClient, HttpErrorResponse} from "@angular/common/http";
import {NewTask, Page, SubTask, Task} from "../tasks/tasks.models";
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

  deleteTask(id: number) {
    this.httpClient.delete(`http://localhost:8080/tasks/${id}`).subscribe({
      next: response => {
        this.tasks.set(this.tasks().filter(task => task.id !== id));
        this.discardTaskForm();
      },
      error: (error: HttpErrorResponse) => {
        let errorBody: ErrorBody = error.error;
        console.log(errorBody);
      }
    });
  }

  addSubtask(taskId: number) {
    this.httpClient.post<SubTask>(`http://localhost:8080/tasks/${taskId}/subtasks`, {
      name: "",
      description: "",
    }).subscribe({
      next: response => {
        this.taskInEdit.set({
          ...this.taskInEdit()!,
          subTasks: [response, ...this.taskInEdit()!.subTasks]
        });
      },
      error: (error: HttpErrorResponse) => {
        let errorBody: ErrorBody = error.error;
        console.log(errorBody);
      }
    });
    this.router.navigate(['/'], {replaceUrl: true});
  }

  updateSubtask(subtaskId: number, details: {name: string; description: string}) {
    this.httpClient.put<SubTask>(`http://localhost:8080/tasks/subtasks/${subtaskId}`, {
      name: details.name,
      description: details.description,
      done: false
    }).subscribe({
      next: response => {
        this.taskInEdit.set({
          ...this.taskInEdit()!,
          subTasks: this.taskInEdit()!.subTasks.map(subtask => subtask.id === response.id ? response : subtask)
        });

        this.tasks.set(this.tasks().map(task =>
          task.id === this.taskInEdit()!.id
            ? {
              ...task,
              subTasks: task.subTasks.map(subtask =>
                subtask.id === response.id ? response : subtask
              )
            }
            : task
        ));
      },
      error: (error: HttpErrorResponse) => {
        let errorBody: ErrorBody = error.error;
        console.log(errorBody);
      }
    });
    this.router.navigate(['/'], {replaceUrl: true});
  }

  completeSubtask(subtaskId: number, details: { name: string; description: string; status: boolean }) {
    this.httpClient.put<SubTask>(`http://localhost:8080/tasks/subtasks/${subtaskId}`, {
      name: details.name,
      description: details.description,
      done: true
    }).subscribe({
      next: response => {
        this.taskInEdit.set({
          ...this.taskInEdit()!,
          subTasks: this.taskInEdit()!.subTasks.map(subtask => subtask.id === response.id ? response : subtask)
        });

        this.tasks.set(this.tasks().map(task =>
          task.id === this.taskInEdit()!.id
            ? {
              ...task,
              subTasks: task.subTasks.map(subtask =>
                subtask.id === response.id ? response : subtask
              )
            }
            : task
        ));
      },
      error: (error: HttpErrorResponse) => {
        let errorBody: ErrorBody = error.error;
        console.log(errorBody);
      }
    });
    this.router.navigate(['/'], {replaceUrl: true});
  }

  deleteSubtask(id: number) {
    this.httpClient.delete(`http://localhost:8080/tasks/subtasks/${id}`).subscribe({
      next: () => {
        this.taskInEdit.set({
          ...this.taskInEdit()!,
          subTasks: this.taskInEdit()!.subTasks.filter(subtask => subtask.id !== id)
        });

        this.tasks.set(this.tasks().map(task =>
          task.id === this.taskInEdit()!.id
            ? {
              ...task,
              subTasks: task.subTasks.filter(subtask => subtask.id !== id)
            }
            : task
        ));
      },
      error: (error: HttpErrorResponse) => {
        let errorBody: ErrorBody = error.error;
        console.log(errorBody);
      }
    });
    this.router.navigate(['/'], {replaceUrl: true});
  }
}
