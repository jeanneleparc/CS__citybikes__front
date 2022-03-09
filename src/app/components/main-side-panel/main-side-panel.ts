import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Component({
  selector: 'main-side-panel',
  templateUrl: './main-side-panel.html',
  styleUrls: ['./main-side-panel.scss'],
})
export class MainSidePanel implements OnInit {
  @Input() $selectedStation: BehaviorSubject<any> = new BehaviorSubject({});
  @Input() loading: boolean = false;
  sidePanel: any;
  sidePanelIsOpen: boolean = false;
  prevSelectedStation: any = {};

  constructor() {}

  ngOnInit(): void {
    this.sidePanel = document.getElementById('mySidepanel');
    this.$selectedStation.subscribe((selectedStation) => {
      this.manageSelectedStation(selectedStation);
    });
  }

  manageSelectedStation(selectedStation: any) {
    // if selected station is empty, close sidePanel
    if (!selectedStation || !selectedStation.id) {
      this.closeSidePanel();
      return;
    }
    // if selected station is the same than before, close panel if it is opened, otherwise open it
    if (selectedStation == this.prevSelectedStation) {
      if (this.sidePanelIsOpen) this.closeSidePanel();
      else this.openSidePanel();
    }
    // if selected station is different, open panel if it is not opened yet
    else {
      this.prevSelectedStation = selectedStation;
      if (!this.sidePanelIsOpen) this.openSidePanel();
    }
  }

  openSidePanel() {
    this.sidePanel.style.width = window.screen.width >= 1024 ? '25%' : '100%';
    this.sidePanelIsOpen = true;
  }

  public closeSidePanel() {
    this.sidePanel.style.width = '0';
    this.sidePanelIsOpen = false;
  }

  isStationActive(station: any) {
    return station.station_status == 'active';
  }
}
