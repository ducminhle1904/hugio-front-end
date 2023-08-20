import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

export interface AppConfig {
  colorScheme: string;
  theme: string;
  menuMode: string;
}

interface LayoutState {
  staticMenuDesktopInactive: boolean;
  overlayMenuActive: boolean;
  staticMenuMobileActive: boolean;
}

@Injectable({
  providedIn: 'root',
})
export class AppLayoutService {
  config: AppConfig = {
    menuMode: 'static',
    colorScheme: 'light',
    theme: 'lara-light-indigo',
  };

  state: LayoutState = {
    staticMenuDesktopInactive: false,
    overlayMenuActive: false,
    staticMenuMobileActive: false,
  };

  private overlayOpen = new Subject<any>();

  overlayOpen$ = this.overlayOpen.asObservable();

  onMenuToggle() {
    if (this.isOverlay()) {
      this.state.overlayMenuActive = !this.state.overlayMenuActive;
      if (this.state.overlayMenuActive) {
        this.overlayOpen.next(null);
      }
    }

    if (this.isDesktop()) {
      this.state.staticMenuDesktopInactive =
        !this.state.staticMenuDesktopInactive;
    } else {
      this.state.staticMenuMobileActive = !this.state.staticMenuMobileActive;

      if (this.state.staticMenuMobileActive) {
        this.overlayOpen.next(null);
      }
    }
  }

  isOverlay() {
    return this.config.menuMode === 'overlay';
  }

  isDesktop() {
    return window.innerWidth > 991;
  }

  isMobile() {
    return !this.isDesktop();
  }
}
