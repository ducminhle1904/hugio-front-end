import { Component, inject } from '@angular/core';
import { UserService } from '@ims/core';

@Component({
  selector: 'ims-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss'],
})
export class LayoutComponent {
  isCollapsed = false;
  userService = inject(UserService);

  public logout() {
    this.userService.logout();
  }
}
