import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ims-remotes-summary-entry',
  template: `<div>
    <div class="grid grid-cols-3 gap-4">
      <ims-order-statistic [title]="'Total orders'"></ims-order-statistic>
      <ims-order-statistic [title]="'Total sales'"></ims-order-statistic>
      <ims-order-statistic [title]="'Cancelled order'"></ims-order-statistic>
    </div>

    <div class="mt-4">
      <p-card header="Sales Chart">
        <ims-sales-chart></ims-sales-chart>
      </p-card>
    </div>
  </div>`,
})
export class RemoteEntryComponent {
  constructor(private router: Router) {}
}
