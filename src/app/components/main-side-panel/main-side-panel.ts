import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'main-side-panel',
  templateUrl: './main-side-panel.html',
  styleUrls: ['./main-side-panel.css'],
})
export class MainSidePanel implements OnInit {
  sidePanel: any;
  sidePanelIsOpen: boolean = false;
  prevSelectedStation: any = {};
  @Input() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});

  constructor() {}

  ngOnInit(): void {
    this.sidePanel = document.getElementById('mySidepanel');
    this.$selectedStation.subscribe((selectedStation) => {
      if (!selectedStation.id) {
        this.closeSidePanel();
        return;
      }
      if (selectedStation == this.prevSelectedStation) {
        if (this.sidePanelIsOpen) {
          this.closeSidePanel();
        } else {
          this.openSidePanel();
        }
      } else {
        this.prevSelectedStation = selectedStation;
        if (!this.sidePanelIsOpen) {
          this.openSidePanel();
        }
      }
    });
  }

  openSidePanel() {
    this.sidePanel.style.width = '25%';
    this.sidePanelIsOpen = true;
  }

  public closeSidePanel() {
    this.sidePanel.style.width = '0';
    this.sidePanelIsOpen = false;
  }
}
