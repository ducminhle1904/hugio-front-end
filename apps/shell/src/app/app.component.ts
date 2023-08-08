import { Component, OnInit, inject } from '@angular/core';
import { PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'ims-root',
  template: `<router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  readonly primengConfig = inject(PrimeNGConfig);

  ngOnInit() {
    this.primengConfig.ripple = true;
  }
}
