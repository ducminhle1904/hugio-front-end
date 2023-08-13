import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterModule } from '@angular/router';
import { UserService } from '@ims/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
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
      <div class="pt-4 ml-[22rem]">
        <div class="content-container mt-16">
          <router-outlet></router-outlet>
        </div>
      </div>
    </div>
  `,
  styles: [
    `
      .content-container {
        position: fixed;
        overflow: auto;
        height: calc(100vh - 7rem);
        width: calc(100vw - 23rem);
      }
    `,
  ],
  imports: [CommonModule, SidebarComponent, RouterModule, TopbarComponent],
})
export class LayoutComponent {
  userService = inject(UserService);

  public logout() {
    this.userService.logout();
  }
}
