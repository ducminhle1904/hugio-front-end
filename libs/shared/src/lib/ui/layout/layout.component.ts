import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '@ims/core';
import { ToastModule } from 'primeng/toast';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { AppLayoutService } from './app-layout.service';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'ims-layout',
  standalone: true,
  template: `
    <div class="layout-wrapper" [ngClass]="containerClass">
      <ims-topbar></ims-topbar>
      <div class="layout-sidebar">
        <ims-sidebar></ims-sidebar>
        <p-button
          #menubutton
          styleClass="p-button-link absolute top-[10px] right-0 md:hidden"
          icon="pi pi-times"
          (click)="layoutService.onMenuToggle()"
        ></p-button>
      </div>
      <div class="layout-main-container">
        <div class="layout-main">
          <router-outlet></router-outlet>
        </div>
      </div>
      <div class="layout-mask"></div>
    </div>
  `,
  styles: [],
  imports: [
    CommonModule,
    SidebarComponent,
    RouterModule,
    TopbarComponent,
    ToastModule,
    ButtonModule,
  ],
})
export class LayoutComponent {
  readonly userService = inject(UserService);

  constructor(public layoutService: AppLayoutService, public router: Router) {}

  public logout() {
    this.userService.logout();
  }

  get containerClass() {
    return {
      'layout-overlay': this.layoutService.config.menuMode === 'overlay',
      'layout-static': this.layoutService.config.menuMode === 'static',
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive &&
        this.layoutService.config.menuMode === 'static',
      'layout-overlay-active': this.layoutService.state.overlayMenuActive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
    };
  }
}
