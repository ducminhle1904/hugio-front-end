import { CommonModule } from '@angular/common';
import { Component, Renderer2, ViewChild, inject } from '@angular/core';
import { Router, RouterModule } from '@angular/router';
import { UserService } from '@ims/core';
import { ToastModule } from 'primeng/toast';
import { SidebarComponent } from '../sidebar/sidebar.component';
import { TopbarComponent } from '../topbar/topbar.component';
import { AppLayoutService } from './app-layout.service';

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
    </div>
  `,
  styles: [],
  imports: [
    CommonModule,
    SidebarComponent,
    RouterModule,
    TopbarComponent,
    ToastModule,
  ],
})
export class LayoutComponent {
  readonly userService = inject(UserService);

  @ViewChild(SidebarComponent) appSidebar!: SidebarComponent;
  @ViewChild(TopbarComponent) appTopbar!: TopbarComponent;

  constructor(
    public layoutService: AppLayoutService,
    public renderer: Renderer2,
    public router: Router
  ) {}

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
      'layout-mobile-active': this.layoutService.state.staticMenuMobileActive,
    };
  }
}
