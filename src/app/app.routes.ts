import { Routes } from "@angular/router";

import { AuthGuard } from "./guards/auth.guard";

export const routes: Routes = [
  {
    path: "",
    redirectTo: "/home",
    pathMatch: "full"
  },
  {
    path: "home",
    loadComponent: () => import("./modules/example-page/example-page.component").then((m) => m.ExamplePageComponent)
  },
  {
    path: "login",
    loadComponent: () => import("./modules/login-page/login-page.component").then((m) => m.LoginPageComponent)
  },
  {
    path: "registration",
    loadComponent: () => import("./modules/registration-page/registration-page.component").then((m) => m.RegistrationPageComponent)
  },
  {
    path: "tasks",
    canActivate: [AuthGuard],
    loadChildren: () => import("./modules/tasks-page/tasks-page.module").then((m) => m.TasksPageModule)
  }
];
