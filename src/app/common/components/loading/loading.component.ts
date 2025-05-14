import { Component, ContentChild, Input, OnInit, OnDestroy, TemplateRef } from '@angular/core';
import { AsyncPipe, CommonModule, NgTemplateOutlet } from '@angular/common';
import { Router, RouteConfigLoadStart, RouteConfigLoadEnd } from '@angular/router';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

import { Observable, Subscription, tap } from 'rxjs';

import { LoadingService } from '../../../services/loading.service';

@Component({
  selector: "loading-indicator",
  templateUrl: "./loading.component.html",
  styleUrls: ["./loading.component.scss"],
  imports: [CommonModule, MatProgressSpinnerModule, AsyncPipe, NgTemplateOutlet],
  standalone: true,
})
export class LoadingIndicatorComponent implements OnInit {
  subscription!: Subscription;
  loading$: Observable<boolean>;

  @Input()
  detectRouteTransitions = false;

  @ContentChild("loading")
  customLoadingIndicator: TemplateRef<any> | null = null;

  constructor(
    private readonly loadingService: LoadingService,
    private readonly router: Router
  ) {
    this.loading$ = this.loadingService.loading$;
  }

  ngOnInit() {
    if (this.detectRouteTransitions) {
      this.subscription = this.router.events
        .pipe(
          tap((event: any) => {
            if (event instanceof RouteConfigLoadStart) {
              this.loadingService.start();
            } else if (event instanceof RouteConfigLoadEnd) {
              this.loadingService.stop();
            }
          })
        )
        .subscribe();
    }
  }

  ngOnDestroy() {
    this.subscription?.unsubscribe();
  }
}
