import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { UserService } from '@ims/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';

@Component({
  selector: 'ims-layout',
  standalone: true,
  template: `
    <div class="layout-wrapper">
      <ims-topbar></ims-topbar>
      <div class="layout-sidebar">
        <ims-sidebar></ims-sidebar>
      </div>
      <div class="layout-main-container">
        <div class="layout-main">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  imports: [CommonModule, SidebarComponent, RouterModule, TopbarComponent],
})
export class LayoutComponent {
  userService = inject(UserService);

  public logout() {
    this.userService.logout();
  }
}
