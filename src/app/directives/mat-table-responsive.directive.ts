import {
  AfterViewInit,
  Directive,
  ElementRef,
  OnDestroy,
  OnInit,
  Renderer2,
} from '@angular/core';
import { BehaviorSubject, combineLatest, filter, Subject } from 'rxjs';
import { map, mapTo, takeUntil } from 'rxjs/operators';

@Directive({
  selector: '[matTableResponsive]',
  standalone: true
})
export class MatTableResponsiveDirective implements OnInit, AfterViewInit, OnDestroy {
  private onDestroy$ = new Subject<boolean>();
  private timeout!: number;
  private thead!: HTMLTableSectionElement;
  private tbody!: HTMLTableSectionElement;

  private theadChanged$ = new BehaviorSubject(true);
  private tbodyChanged$ = new Subject<boolean>();

  private theadObserver = new MutationObserver(() =>
    this.theadChanged$.next(true)
  );
  private tbodyObserver = new MutationObserver(() =>
    this.tbodyChanged$.next(true)
  );

  constructor(private table: ElementRef, private renderer: Renderer2) {}

  ngOnInit() {
    this.timeout = setTimeout(() => {
      this.thead = this.table.nativeElement.querySelector('thead');
      this.tbody = this.table.nativeElement.querySelector('tbody');

      this.theadObserver.observe(this.thead, {
        characterData: true,
        subtree: true,
      });
      this.tbodyObserver.observe(this.tbody, { childList: true });

      this.initialize();
    }, 100);
  }

  ngAfterViewInit() {

  }

  ngOnDestroy(): void {
    clearTimeout(this.timeout);
    this.theadObserver.disconnect();
    this.tbodyObserver.disconnect();

    this.onDestroy$.next(true);
  }

  private initialize() {
    /**
     * Set the "data-column-name" attribute for every body row cell, either on
     * thead row changes (e.g. language changes) or tbody rows changes (add, delete).
     */
    combineLatest([
      this.theadChanged$,
      this.tbodyChanged$
    ])
      .pipe(
        mapTo({ headRow: this.thead.rows.item(0)!, bodyRows: this.tbody.rows }),
        map(({ headRow, bodyRows }) => {
          const columnNames = [];
          for (let i = 0, length = headRow.children.length; i < length; i++) {
            columnNames.push(headRow.children[i].textContent!);
          }

          const rows = [];
          for (let i = 0, length = bodyRows.length; i < length; i++) {
            rows.push(bodyRows[i].children);
          }

          return { columnNames, rows };
        }),
        takeUntil(this.onDestroy$)
      )
      .subscribe(({ columnNames, rows }) => {
        rows.forEach((rowCells) => {
          for (let i = 0, length = rowCells.length; i < length; i++) {
            this.renderer.setAttribute(
              rowCells[i],
              'data-column-name',
              columnNames[(rowCells[i] as HTMLTableCellElement).cellIndex]
            )
          }
        });
      });
  }
}
