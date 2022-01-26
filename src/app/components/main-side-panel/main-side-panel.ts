import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'main-side-panel',
  templateUrl: './main-side-panel.html',
  styleUrls: ['./main-side-panel.css'],
})
export class MainSidePanel implements OnInit {
  sidebar: any;
  sidePanelIsOpen: boolean = false;
  prevSelectedStation: any = {};
  @Input() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});

  constructor() {}

  ngOnInit(): void {
    this.sidebar = document.getElementById('mySidepanel');
    this.$selectedStation.subscribe((selectedStation) => {
      if (!selectedStation.id) {
        return;
      }
      if (selectedStation == this.prevSelectedStation) {
        if (this.sidePanelIsOpen) {
          this.closeSidebar();
        } else {
          this.openSidebar();
        }
      } else {
        this.prevSelectedStation = selectedStation;
        if (!this.sidePanelIsOpen) {
          this.openSidebar();
        }
      }
    });
  }

  openSidebar() {
    this.sidebar.style.width = '25%';
    this.sidePanelIsOpen = true;
  }

  public closeSidebar() {
    this.sidebar.style.width = '0';
    this.sidePanelIsOpen = false;
  }
}
