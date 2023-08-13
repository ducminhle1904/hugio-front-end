import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'ims-order-list',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule],
  template: `<p-card header="Order List" styleClass="h-full"></p-card>`,
  styles: [],
})
export class OrderListComponent {}
