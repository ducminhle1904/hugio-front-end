import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ims-remotes-summary-entry',
  template: `<button nz-button nzType="primary" (click)="route()">
    Primary
  </button>`,
})
export class RemoteEntryComponent {
  constructor(private router: Router) {}

  route() {
    this.router.navigate(['remotes-product']);
  }
}
