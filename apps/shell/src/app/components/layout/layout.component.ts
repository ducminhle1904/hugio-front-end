import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '@ims/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { LayoutService } from '../../service/layout.service';

@Component({
  selector: 'ims-layout',
  standalone: true,
  template: `
    <div class="layout-wrapper" [ngClass]="containerClass">
      <ims-topbar></ims-topbar>
      <div class="layout-sidebar">
        <ims-sidebar></ims-sidebar>
      </div>
      <div class="layout-main-container">
        <div class="layout-main">
          <router-outlet></router-outlet>
        </div>
      </div>
      <div class="layout-mask"></div>
    </div>
  `,
  imports: [CommonModule, SidebarComponent, RouterModule, TopbarComponent],
})
export class LayoutComponent {
  userService = inject(UserService);
  layoutService = inject(LayoutService);

  public logout() {
    this.userService.logout();
  }

  get containerClass() {
    return {
      'layout-static-inactive':
        this.layoutService.state.staticMenuDesktopInactive,
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
    };
  }
}
