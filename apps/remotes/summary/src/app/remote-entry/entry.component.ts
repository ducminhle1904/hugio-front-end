import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'ims-remotes-summary-entry',
  template: `<div>
    <div class="grid grid-cols-4 gap-4">
      <p-card header="Total orders">
        <p class="font-extrabold text-4xl lg:text-6xl">342</p>
        <span class="text-green-400"
          ><i class="pi pi-arrow-up mr-1"></i>4.2%</span
        ><span> from last month</span>

        <ng-template pTemplate="footer">
          <p-button
            label="View detail"
            icon="pi pi-chevron-right"
            iconPos="right"
            styleClass="p-button-outlined p-button-success"
          ></p-button>
        </ng-template>
      </p-card>
      <p-card header="Total sales">
        <p class="font-extrabold text-4xl lg:text-6xl">$1,290</p>
        <span class="text-green-400"
          ><i class="pi pi-arrow-up mr-1"></i>2.2%</span
        ><span> from last month</span>
        <ng-template pTemplate="footer">
          <p-button
            label="View detail"
            icon="pi pi-chevron-right"
            iconPos="right"
            styleClass="p-button-outlined p-button-success"
          ></p-button>
        </ng-template>
      </p-card>
      <p-card header="Net sales">
        <p class="font-extrabold text-4xl lg:text-6xl">$1,940</p>
        <span class="text-green-400"
          ><i class="pi pi-arrow-up mr-1"></i>4.0%</span
        ><span> from last month</span>
        <ng-template pTemplate="footer">
          <p-button
            label="View detail"
            icon="pi pi-chevron-right"
            iconPos="right"
            styleClass="p-button-outlined p-button-success"
          ></p-button>
        </ng-template>
      </p-card>
      <p-card header="Cancelled order">
        <p class="font-extrabold text-4xl lg:text-6xl">12</p>
        <span class="text-red-400"
          ><i class="pi pi-arrow-down mr-1"></i>1.5%</span
        ><span> from last month</span>
        <ng-template pTemplate="footer">
          <p-button
            label="View detail"
            icon="pi pi-chevron-right"
            iconPos="right"
            styleClass="p-button-outlined p-button-success"
          ></p-button>
        </ng-template>
      </p-card>
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
