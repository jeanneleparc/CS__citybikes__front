import { Component, Input, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { colors } from 'src/colors';

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
  colors: any = colors;
  tabs: Array<{ name: string; title: string }> = [
    {
      name: 'main',
      title: 'Main',
    },
    {
      name: 'matrix',
      title: 'Stats by week',
    },
  ];
  currentTab: string = 'main';

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
      this.sidePanel.style.width = '0';
      this.sidePanelIsOpen = false;
      return;
    }
    this.openSidePanel();
  }

  openSidePanel() {
    this.sidePanel.style.width = window.screen.width >= 1024 ? '25%' : '100%';
    this.sidePanelIsOpen = true;
  }

  public closeSidePanel() {
    this.sidePanel.style.width = '0';
    this.sidePanelIsOpen = false;
    this.$selectedStation.next(null);
  }

  isStationActive(station: any) {
    return station?.station_status == 'active';
  }

  changeTab(tab: any) {
    this.currentTab = tab.name;
  }
}
