import { Routes } from "@angular/router";

export const routes: Routes = [
  {
    path: "",
    loadComponent: () => import("./list/tasks-list.component").then((m) => m.TasksListPageComponent),
  },
  {
    path: "create",
    loadComponent: () => import("./create/tasks-create.component").then((m) => m.TasksCreatePageComponent),
  },
  {
    path: "update/:id",
    loadComponent: () => import("./update/tasks-update.component").then((m) => m.TasksUpdatePageComponent),
  }
];
