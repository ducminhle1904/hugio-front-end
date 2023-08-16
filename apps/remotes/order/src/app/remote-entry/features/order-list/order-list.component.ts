import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  inject,
  ViewEncapsulation,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderResponseDTO } from '@ims/core';
import { OrderService } from '@ims/data-access';
import { LoadingOverlayService } from '@ims/shared';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';

@Component({
  selector: 'ims-order-list',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule, TableModule],
  template: `<p-card header="Order List" styleClass="h-full">
    <p-table
      [value]="orders.response.content"
      styleClass="p-datatable-sm"
      dataKey="total_price"
      [paginator]="true"
      [rows]="10"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      [rowsPerPageOptions]="[10, 25, 50]"
      [scrollable]="true"
      scrollHeight="'100%'"
      *ngIf="orders"
    >
      <ng-template pTemplate="header">
        <tr>
          <th style="width: 5rem"></th>
          <th>Order</th>
          <th>Created At</th>
          <th>Created By</th>
          <th>Total Price</th>
        </tr>
      </ng-template>
      <ng-template
        pTemplate="body"
        let-order
        let-expanded="expanded"
        let-index="rowIndex"
      >
        <tr>
          <td>
            <button
              type="button"
              pButton
              pRipple
              [pRowToggler]="order"
              class="p-button-text p-button-rounded p-button-plain"
              [icon]="expanded ? 'pi pi-chevron-down' : 'pi pi-chevron-right'"
            ></button>
          </td>
          <td class="text-lg font-extrabold">Order - {{ index }}</td>
          <td>
            {{ order.created_at }}
          </td>
          <td>{{ order.created_by }}</td>
          <td>{{ order.total_price }}</td>
        </tr>
      </ng-template>
      <ng-template pTemplate="rowexpansion" let-order>
        <tr>
          <td colspan="7">
            <div class="p-3">
              <p-table [value]="order.order_detail" dataKey="id">
                <ng-template pTemplate="header">
                  <tr>
                    <th>Id</th>
                    <th>Product name</th>
                    <th>Product Description</th>
                    <th>Price</th>
                    <th>Quantity</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-order>
                  <tr>
                    <td>{{ order.product.id }}</td>
                    <td>{{ order.product.product_name }}</td>
                    <td>{{ order.product.product_description }}</td>
                    <td>{{ order.product.price }}</td>
                    <td>{{ order.quantity }}</td>
                  </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                  <tr>
                    <td colspan="6">
                      There are no order for this product yet.
                    </td>
                  </tr>
                </ng-template>
              </p-table>
            </div>
          </td>
        </tr>
      </ng-template>
    </p-table>
  </p-card>`,
  styles: [
    `
      ::ng-deep .p-datatable-wrapper {
        height: calc(100% - 60px);
      }
      ::ng-deep .p-card-body {
        height: 100%;
      }
      ::ng-deep .p-card-content {
        height: 95%;
      }
      ::ng-deep .p-datatable {
        height: 100%;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
})
export class OrderListComponent implements OnInit {
  readonly orderService = inject(OrderService);
  readonly loadingOverlayService = inject(LoadingOverlayService);
  readonly destroyRef = inject(DestroyRef);

  public orders!: OrderResponseDTO;

  ngOnInit(): void {
    this.fetchOrders();
  }

  private fetchOrders(): void {
    this.loadingOverlayService.show();
    this.orderService
      .queryListOrder()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.loadingOverlayService.hide();
        this.orders = data;
      });
  }
}
