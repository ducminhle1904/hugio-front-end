import { CommonModule } from '@angular/common';
import { Component, ViewEncapsulation, inject } from '@angular/core';
import { UserService } from '@ims/core';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { RouterModule } from '@angular/router';
import { TopbarComponent } from '../topbar/topbar.component';
import { CardModule } from 'primeng/card';

@Component({
  selector: 'ims-layout',
  standalone: true,
  template: `
    <div class="layout-wrapper">
      <ims-topbar></ims-topbar>
      <div class="layout-sidebar">
        <ims-sidebar></ims-sidebar>
      </div>
      <div class="p-4 ml-[22rem]">
        <p-card styleClass="content-container mt-16">
          <router-outlet></router-outlet>
        </p-card>
      </div>
    </div>
  `,
  styles: [
    `
      .p-card .p-card-body {
        height: 100%;
      }
      .p-card .p-card-content {
        height: 100%;
      }
    `,
  ],
  imports: [
    CommonModule,
    SidebarComponent,
    RouterModule,
    TopbarComponent,
    CardModule,
  ],
  encapsulation: ViewEncapsulation.None,
})
export class LayoutComponent {
  userService = inject(UserService);

  public logout() {
    this.userService.logout();
  }
}
