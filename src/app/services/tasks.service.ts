// @TODO normally this services inherit a parent service
// containing some kind of cache mechanism to optimize API requests
// it can be also implemented in an interceptor. I think the best way is up to you
// and the project purpose

import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { map } from "rxjs";

import { Task } from "../common/interfaces/task.interface";
import env from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class TasksService {
  private readonly http: HttpClient = inject(HttpClient);

  getTasksForUser(userId: string) {
    const url = `${env.appApiUrl}${env.endpoints.tasks}/owner/${userId}`;

    return this.http.get(url)
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }

  createTask(task: Task) {
    const url = `${env.appApiUrl}${env.endpoints.tasks}`;

    return this.http.post(url, task)
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }

  getTask(id: string) {
    const url = `${env.appApiUrl}${env.endpoints.tasks}/${id}`;

    return this.http.get(url)
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }

  updateTask(id: string, task: Task) {
    const url = `${env.appApiUrl}${env.endpoints.tasks}/${id}`;

    return this.http.put(url, task)
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }

  deleteTask(id: string) {
    const url = `${env.appApiUrl}${env.endpoints.tasks}/${id}`;

    return this.http.delete(url)
      .pipe(
        map((response: any) => {
          return response.data;
        })
      );
  }
}
