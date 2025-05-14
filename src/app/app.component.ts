import { Component, OnInit, OnDestroy } from '@angular/core';
import { CommonModule, NgOptimizedImage } from "@angular/common";
import { RouterOutlet, RouterModule } from "@angular/router";
import { BreakpointObserver } from "@angular/cdk/layout";

import { Subscription, tap, combineLatest } from "rxjs";

// import { PageSubtitleService } from "@app/services"
import { PageSubtitleService } from "./services/page-subtitle.service";
import { LoadingIndicatorComponent } from './common/components/loading/loading.component';

@Component({
  selector: "app-root",
  standalone: true,
  imports: [RouterOutlet, RouterModule, CommonModule, NgOptimizedImage, LoadingIndicatorComponent],
  templateUrl: "./app.component.html",
  styleUrl: "./app.component.scss"
})
export class AppComponent implements OnInit, OnDestroy {
  private timeout!: number;

  protected subscription!: Subscription;

  title = "atom-challenge-fe-template";
  subtitle: string | null = null;

  isMobile = false;

  get showSubtitleInHeader(): boolean {
    return !!this.subtitle && !this.isMobile;
  }

  constructor(
    protected readonly responsive: BreakpointObserver,
    public readonly subtitleService: PageSubtitleService
  ) {}

  ngOnInit() {
    this.subscription = combineLatest([
      this.responsive.observe(["(max-width: 600px)"])
        .pipe(
          tap((result) => {
            this.isMobile = result.matches;
          })
        ),
      this.subtitleService.subtitle$
        .pipe(
          tap((subtitle) => {
            this.timeout = setTimeout(() => {
              this.subtitle = subtitle;
            }, 0);
          })
        )
    ]).subscribe();
  }

  ngOnDestroy() {
    this.subscription.unsubscribe();
    clearTimeout(this.timeout);
  }
}
