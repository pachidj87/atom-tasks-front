import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TasksPageRoutingModule } from './tasks-page-routing.module';

@NgModule({
  imports: [
    CommonModule, TasksPageRoutingModule
  ]
})
export class TasksPageModule { }
