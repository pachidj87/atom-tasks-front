import { AfterViewInit, Component, OnInit, OnDestroy, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatListModule } from '@angular/material/list';
import { RouterModule } from '@angular/router';
import { LiveAnnouncer} from '@angular/cdk/a11y';
import { MatSort, Sort, MatSortModule } from '@angular/material/sort';
import { MatTableDataSource, MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatIconModule } from '@angular/material/icon';
import { MatDialog } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

import { catchError, firstValueFrom, filter, map, Subscription, switchMap } from 'rxjs';

import { MatTableResponsiveDirective } from "../../../directives/mat-table-responsive.directive";
import { PageSubtitleService } from "../../../services/page-subtitle.service"
import { TasksService } from "../../../services/tasks.service"
import { AuthService } from "../../../services/auth.service"
import { Task } from '../../../common/interfaces/task.interface';
import { DialogComponent } from '../../../common/components/dialog/dialog.component';

@Component({
  selector: 'app-tasks-list-page',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    MatIconModule,
    MatButtonModule,
    MatTableModule,
    MatPaginatorModule,
    MatSortModule,
    MatTableResponsiveDirective
  ],
  templateUrl: './tasks-list.component.html',
  styleUrl: './tasks-list.component.scss'
})
export class TasksListPageComponent implements OnInit, OnDestroy {
  private readonly liveAnnouncer = inject(LiveAnnouncer);
  private readonly subtitleService = inject(PageSubtitleService);
  private readonly dialog = inject(MatDialog);
  private readonly tasksService = inject(TasksService);
  private readonly authService = inject(AuthService);
  private subscription!: Subscription;

  @ViewChild(MatSort) sort!: MatSort;
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  displayedColumns: string[] = ['title', 'description', 'createdAt', 'isCompleted', 'actions'];
  dataSource!: MatTableDataSource<Task>;
  showError = false;

  async ngOnInit() {
    this.subtitleService.setSubtitle("Listado de Tareas");

    // @TODO Create some kind of pagination in the API and then here in the list
    // but for now just demonstating hability to query an API endpoint
    await this.loadData();
    this.dataSource.sort = this.sort;
    this.dataSource.paginator = this.paginator;
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }

  announceSortChange(sortState: Sort) {
    if (sortState.direction) {
      this.liveAnnouncer.announce(`Sorted ${sortState.direction}ending`);
    } else {
      this.liveAnnouncer.announce('Sorting cleared');
    }
  }

  async deleteTask(taskId: string) {
    this.subscription?.unsubscribe();

    const dialogRef = this.dialog.open(DialogComponent, {
      width: '350px',
      data: {
        title: 'Eliminar Tarea',
        message: '¿Estás seguro de que deseas eliminar esta tarea?',
        cancelButtonText: 'Cancelar',
        confirmButtonText: 'Eliminar',
      }
    });

    this.subscription = dialogRef.afterClosed()
        .pipe(
          filter(result => !!result),
          switchMap((result) => this.tasksService.deleteTask(taskId)),
          map((result: any) => {
            if (!result?.deleted) throw new Error("Error ocurred");
            this.showError = false;
            this.loadData();
          }),
          catchError(async (error: any) => {
            this.showError = true;
          })
        )
        .subscribe();
  }

  async changeStatus(task: Task) {
    const updateTask$ = this.tasksService.updateTask(
      task.id as string,
      {
        ...task,
        isCompleted: !task.isCompleted,
        createdAt: undefined,
        updatedAt: undefined
      }
    );
    const response = await firstValueFrom(updateTask$)
      .catch((error: any) => {
        this.showError = true;
        return false;
      });

    if (!response) return;

    this.loadData();
  }

  async loadData() {
    const user = this.authService.getCurrentUser();
    const userTasks$ = this.tasksService.getTasksForUser(user?.id || '');
    this.dataSource = await firstValueFrom(userTasks$)
      .then((tasks) => {
        this.showError = false;
        return new MatTableDataSource<Task>(tasks);
      })
      .catch((error: any) => {
        this.showError = true;
        return new MatTableDataSource<Task>([]);
      });
  }
}
