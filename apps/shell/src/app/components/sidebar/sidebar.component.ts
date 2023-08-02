import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
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
  model: any[] = [];

  ngOnInit() {
    this.model = [
      {
        label: 'GENERAL',
        items: [
          {
            label: 'Summary',
            icon: 'pi pi-fw pi-th-large',
            routerLink: ['/remotes-summary'],
          },
          {
            label: 'Analysis',
            icon: 'pi pi-fw pi-chart-bar',
            routerLink: ['/remotes-analysis'],
          },
          {
            label: 'Cashbook',
            icon: 'pi pi-fw pi-wallet',
            routerLink: ['/remotes-cashbook'],
          },
        ],
      },
      {
        label: 'MANAGEMENT',
        items: [
          { label: 'User', icon: 'pi pi-fw pi-user', routerLink: ['/'] },
          { label: 'Product', icon: 'pi pi-fw pi-inbox', routerLink: ['/'] },
        ],
      },
      {
        label: 'APP',
        items: [
          { label: 'Chat', icon: 'pi pi-fw pi-comments', routerLink: ['/'] },
          {
            label: 'Calendar',
            icon: 'pi pi-fw pi-calendar',
            routerLink: ['/'],
          },
        ],
      },
    ];
  }
}
