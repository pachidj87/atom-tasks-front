import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { routes } from './tasks-page.routes';

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class TasksPageRoutingModule {}
