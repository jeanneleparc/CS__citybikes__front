import { Component, EventEmitter, Input, Output } from '@angular/core';

export interface MenuIndex {
  menuIndex: number;
  submenuIndex: number;
}

export interface MenuItem {
  text: string;
  subMenu: Array<{
    text: string;
    value: number;
  }>;
}

@Component({
  selector: 'dropdown-menu',
  templateUrl: './dropdown-menu.html',
  styleUrls: ['./dropdown-menu.scss'],
})
export class DropdownMenuComponent {
  @Input() public menuItems: Array<MenuItem> = [];
  @Output() public itemSelected = new EventEmitter<MenuIndex>();

  public onClick(event: MouseEvent, menuIndex: number, submenuIndex: number) {
    event.stopPropagation();
    this.itemSelected.emit({
      menuIndex: menuIndex,
      submenuIndex: submenuIndex,
    });
  }
}
