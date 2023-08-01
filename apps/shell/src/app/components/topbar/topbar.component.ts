import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LayoutService } from '../../service/layout.service';

@Component({
  selector: 'ims-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule],
  template: `<div class="layout-topbar">
    <a class="layout-topbar-logo" routerLink="">
      <img
        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
        alt="logo"
      />
      <span>IMS</span>
    </a>

    <button
      #menubutton
      class="p-link layout-menu-button layout-topbar-button"
      (click)="layoutService.onMenuToggle()"
    >
      <i class="pi pi-bars"></i>
    </button>

    <!-- <button
      #topbarmenubutton
      class="p-link layout-topbar-menu-button layout-topbar-button"
      (click)="layoutService.showProfileSidebar()"
    >
      <i class="pi pi-ellipsis-v"></i>
    </button> -->
  </div>`,
  styles: [],
})
export class TopbarComponent {
  layoutService = inject(LayoutService);
}
