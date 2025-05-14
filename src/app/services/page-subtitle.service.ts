import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class PageSubtitleService {
  private subtitleSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
  public subtitle$!: Observable<string | null>;

  constructor() {
    this.subtitle$ = this.subtitleSubject.asObservable();
  }

  setSubtitle(subtitle: string): void {
    this.subtitleSubject.next(subtitle);
  }
}
