import {inject, Injectable} from "@angular/core";
import {HttpClient} from "@angular/common/http";
import {Page} from "../tasks/tasks.models";

@Injectable({providedIn: 'root'})
export class DashboardService {
  private httpClient = inject(HttpClient);


  fetchUserTasks() {
    return this.httpClient.get<Page>('http://localhost:8080/tasks');
  }
}
