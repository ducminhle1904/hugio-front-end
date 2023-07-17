import { Component } from '@angular/core';

@Component({
  selector: 'ims-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent {
  isCollapsed = false;
}
