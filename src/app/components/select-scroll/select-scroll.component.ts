import { Component, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'select-scroll',
  templateUrl: './select-scroll.component.html',
  styleUrls: ['./select-scroll.component.css'],
})
export class SelectScrollComponent implements OnInit {
  @Input() values: string[] = [];
  @Output() selectedValuesId$: BehaviorSubject<number> = new BehaviorSubject(0);

  selectedValue$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {}

  ngOnInit(): void {
    this.selectedValuesId$.subscribe((id) => {
      this.selectedValue$.next(this.values[id]);
    });
  }

  goToNext(): void {
    this.selectedValuesId$.next(
      (this.selectedValuesId$.value + 1) % this.values.length
    );
  }

  goToPrevious(): void {
    this.selectedValuesId$.next(
      (this.selectedValuesId$.value + this.values.length - 1) %
        this.values.length
    );
  }
}
