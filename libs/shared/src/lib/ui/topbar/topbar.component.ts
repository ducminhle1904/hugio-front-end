import { CommonModule } from '@angular/common';
import {
  Component,
  ElementRef,
  OnInit,
  ViewChild,
  inject,
} from '@angular/core';
import { RouterModule } from '@angular/router';
import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { ButtonModule } from 'primeng/button';
import { AppLayoutService } from '../layout/app-layout.service';

@Component({
  selector: 'ims-topbar',
  standalone: true,
  imports: [CommonModule, RouterModule, AvatarModule, MenuModule, ButtonModule],
  template: `<header>
    <nav class="fixed w-full z-50 px-4 lg:px-6 py-2.5 bg-[#161d21]">
      <div class="flex flex-wrap justify-between items-center">
        <div class="flex items-center gap-5">
          <a href="https://flowbite.com" class="flex items-center">
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              class="mr-3 h-6 sm:h-9"
              alt="Flowbite Logo"
            />
            <span
              class="self-center text-xl font-semibold whitespace-nowrap dark:text-white"
              >IMS</span
            >
          </a>
          <p-button
            #menubutton
            styleClass="p-button-link"
            icon="pi pi-bars"
            (click)="layoutService.onMenuToggle()"
          ></p-button>
        </div>

        <div class="flex items-center lg:order-2">
          <p-menu #menu [model]="items" [popup]="true"></p-menu>
          <p-avatar
            icon="pi pi-user"
            styleClass="mr-2 cursor-pointer"
            (click)="menu.toggle($event)"
          ></p-avatar>
        </div>
      </div>
    </nav>
  </header>`,
  styles: [],
})
export class TopbarComponent implements OnInit {
  readonly layoutService = inject(AppLayoutService);
  public items: MenuItem[] | undefined;

  @ViewChild('menubutton') menuButton!: ElementRef;

  ngOnInit() {
    this.items = [
      {
        label: 'Profile',
        icon: 'pi pi-fw pi-user',
      },
      {
        label: 'Logout',
        icon: 'pi pi-fw pi-sign-out',
      },
    ];
  }
}
