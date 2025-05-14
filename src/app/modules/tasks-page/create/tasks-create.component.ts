import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, FormGroup, FormControl, Validators, ReactiveFormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { RouterModule, Router } from '@angular/router';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCheckboxModule } from '@angular/material/checkbox';

import { firstValueFrom } from 'rxjs';

import { User } from '../../../common/interfaces/user.interface';
import { Task } from '../../../common/interfaces/task.interface';
import { FormPageComponent } from '../../../common/components/form-page.component';
import { PageSubtitleService } from '../../../services/page-subtitle.service';
import { TasksService } from '../../../services/tasks.service';
import { AuthService } from '../../../services/auth.service';

@Component({
  selector: 'app-tasks-create-page',
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
  templateUrl: './tasks-create.component.html',
  styleUrl: './tasks-create.component.scss'
})
export class TasksCreatePageComponent extends FormPageComponent {
  private readonly subtitleService = inject(PageSubtitleService);
  private readonly tasksService = inject(TasksService);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);

  showError: boolean = false;
  isCompleted: boolean = false;

  ngOnInit() {
    this.subtitleService.setSubtitle('Nueva Tarea');

    this.form = new FormGroup({
      title: new FormControl('', [Validators.required]),
      description: new FormControl('', [Validators.required]),
      isCompleted: new FormControl(false)
    });
  }

  async createTask() {
    // Implement the logic to create a task
    const user: User = this.authService.getCurrentUser() as User;
    const task: Task = { ...this.form.value, ownerId: user.id };
    const createTask$ = this.tasksService.createTask(task);
    const response = await firstValueFrom(createTask$)
      .catch((error: any) => {
        this.showError = true;
      });

    this.router.navigate(['/tasks'], { state: { update: true } })
  }

  updateStatus($event: any) {
    this.isCompleted = $event.checked;
  }
}
