import { Component, Input, OnInit, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'select-scroll',
  templateUrl: './select-scroll.component.html',
  styleUrls: ['./select-scroll.component.scss'],
})
export class SelectScrollComponent implements OnInit {
  @Input() values: string[] = [];
  @Input() startValueId: number = 0;
  @Output() selectedValuesId$: BehaviorSubject<number> = new BehaviorSubject(
    this.startValueId
  );

  selectedValue$: BehaviorSubject<string> = new BehaviorSubject('');

  constructor() {}

  ngOnInit(): void {
    this.selectedValuesId$.next(this.startValueId);
    this.selectedValue$.next(this.values[this.startValueId]);
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
