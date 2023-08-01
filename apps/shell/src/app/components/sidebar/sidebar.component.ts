import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../service/layout.service';
import { SidebarModule } from 'primeng/sidebar';
import { MenuitemComponent } from './menuitem.component';

@Component({
  selector: 'ims-sidebar',
  standalone: true,
  imports: [CommonModule, SidebarModule, MenuitemComponent],
  template: `<ul class="layout-menu">
    <ng-container *ngFor="let item of model; let i = index">
      <li
        app-menuitem
        *ngIf="!item.separator"
        [item]="item"
        [index]="i"
        [root]="true"
      ></li>
      <li *ngIf="item.separator" class="menu-separator"></li>
    </ng-container>
  </ul> `,
  styles: [],
})
export class SidebarComponent implements OnInit {
  readonly layoutService = inject(LayoutService);
  model: any[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'Home',
        items: [
          { label: 'Dashboard', icon: 'pi pi-fw pi-home', routerLink: ['/'] },
        ],
      },
    ];
  }
}
