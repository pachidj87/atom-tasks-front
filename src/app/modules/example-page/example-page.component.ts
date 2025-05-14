import { CommonModule } from "@angular/common";
import { Component, OnInit } from "@angular/core";
import { MatButton } from "@angular/material/button";
import { RouterModule } from "@angular/router";

import { Subscription, tap } from "rxjs";

// import { BreakpointAwareComponent } from "@common/components";
// import { SubtitledPageInterface } from "@common/intefaces";
import { PageSubtitleService } from "../../services/page-subtitle.service"

@Component({
    selector: "app-example-page",
    standalone: true,
    imports: [
      MatButton,
      CommonModule,
      RouterModule
    ],
    templateUrl: "./example-page.component.html",
    styleUrl: "./example-page.component.scss"
})
export class ExamplePageComponent implements OnInit {
  constructor(private readonly subtitleService: PageSubtitleService) {}

  ngOnInit() {
    this.subtitleService.setSubtitle("Reto Técnico");
  }
}
