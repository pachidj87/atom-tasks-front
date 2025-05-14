import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, ActivatedRoute, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { firstValueFrom, switchMap } from 'rxjs';

import { FormPageComponent } from '../../../common/components/form-page.component';
import { PageSubtitleService } from '../../../services/page-subtitle.service';
import { TasksService } from '../../../services/tasks.service';
import { Task } from '../../../common/interfaces/task.interface';
import { DialogComponent } from '../../../common/components/dialog/dialog.component';

@Component({
  selector: 'app-tasks-update-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    MatCheckboxModule
  ],
  templateUrl: './tasks-update.component.html',
  styleUrl: './tasks-update.component.scss'
})
export class TasksUpdatePageComponent extends FormPageComponent {
  private readonly subtitleService = inject(PageSubtitleService);
  private readonly tasksService = inject(TasksService);
  private readonly activatedRoute = inject(ActivatedRoute);
  private readonly router = inject(Router);

  isCompleted: boolean = false;
  taskId: string | null = null;

  // @TODO messages could be some kind of notifications system, I use this for simplicity
  showError: boolean = false;
  showSuccess: boolean = false;

  async ngOnInit() {
    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      ownerId: new FormControl('', [Validators.required]),
      isCompleted: new FormControl(false)
    });

    const task$ = this.activatedRoute.params
      .pipe(
        switchMap((params: any) => {
          this.taskId = params.id;
          return this.tasksService.getTask(this.taskId as string);
        })
      );

    const task: Task | null = await firstValueFrom(task$)
      .catch((error: any) => {
        this.showError = true;
        return null;
      });

    if (!task) return;

    this.form.patchValue(task);
    this.isCompleted = task.isCompleted;
    this.subtitleService.setSubtitle(`Actualizar: ${task.title}`);
  }

  async updateTask() {
    this.showError = false;
    const updateTask$ = this.tasksService.updateTask(this.taskId as string, this.form.value);
    const response = await firstValueFrom(updateTask$)
      .catch((error: any) => {
        this.showError = true;
        return false;
      });

    if (!response) return;
    this.subtitleService.setSubtitle(`Actualizar: ${response.title}`);

    this.showSuccess = true;
  }

  updateStatus($event: any) {
    this.isCompleted = $event.checked;
  }
}
