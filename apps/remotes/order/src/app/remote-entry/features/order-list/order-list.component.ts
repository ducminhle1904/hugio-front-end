import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { NotificationService, OrderResponse, ResponseModel } from '@ims/core';
import { OrderService } from '@ims/data-access';
import { LoadingOverlayService } from '@ims/shared';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { Observable } from 'rxjs';

@Component({
  selector: 'ims-order-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    TableModule,
    TagModule,
    ToastModule,
  ],
  template: `<p-card header="Order List" styleClass="h-full">
    <p-table
      [value]="orders.response.content"
      styleClass="p-datatable-sm"
      dataKey="order_code"
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
          <th>Order Code</th>
          <th>Status</th>
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
          <td class="text-lg font-extrabold">{{ order.order_code }}</td>
          <td>
            <p-tag
              [severity]="getSeverity(order.order_status)"
              [value]="order.order_status"
            ></p-tag>
          </td>
          <td>
            {{ order.created_at }}
          </td>
          <td>{{ order.created_by }}</td>
          <td>
            {{
              order.total_price | currency : 'VND' : 'symbol-narrow' : '1.0-0'
            }}
          </td>
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
                    <th>Quantity</th>
                    <th>Price</th>
                  </tr>
                </ng-template>
                <ng-template pTemplate="body" let-orderdetail>
                  <tr>
                    <td>{{ orderdetail.product.id }}</td>
                    <td>{{ orderdetail.product.product_name }}</td>
                    <td>{{ orderdetail.product.product_description }}</td>
                    <td>{{ orderdetail.quantity }}</td>
                    <td>
                      {{
                        orderdetail.product.price
                          | currency : 'VND' : 'symbol-narrow' : '1.0-0'
                      }}
                    </td>
                  </tr>
                </ng-template>
                <ng-template pTemplate="emptymessage">
                  <tr>
                    <td colspan="6">
                      There are no order for this product yet.
                    </td>
                  </tr>
                </ng-template>
                <ng-template pTemplate="footer">
                  <tr>
                    <td colspan="6">
                      <div class="flex items-center justify-between">
                        <div class="flex flex-col gap-2">
                          <p class="font-normal">
                            Customer: {{ order?.customer_name || 'Guest' }}
                          </p>
                          <p class="font-normal">
                            Phone number:
                            {{
                              order?.phone_number ||
                                'Customer without phone number'
                            }}
                          </p>
                        </div>
                        <div
                          *ngIf="order.order_status === 'PENDING'"
                          class="flex gap-2"
                        >
                          <p-button
                            label="Confirm"
                            icon="pi pi-check"
                            styleClass="p-button-outlined p-button-success"
                            (click)="confirmOrder(order.order_code)"
                          ></p-button>
                          <p-button
                            label="Cancel"
                            icon="pi pi-replay"
                            styleClass="p-button-outlined p-button-danger"
                            (click)="cancelOrder(order.order_code)"
                          ></p-button>
                        </div>
                      </div>
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
      :host ::ng-deep .p-datatable-wrapper {
        height: calc(100% - 60px);
      }
      :host ::ng-deep .p-card-body {
        height: 100%;
      }
      :host ::ng-deep .p-card-content {
        height: 95%;
      }
      :host ::ng-deep .p-datatable {
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
  readonly notificationService = inject(NotificationService);

  public orders!: OrderResponse;

  ngOnInit(): void {
    this.fetchOrders();
  }

  public getSeverity(status: string): string {
    switch (status) {
      case 'PENDING':
        return 'warning';
      case 'DONE':
        return 'success';
      default:
        return 'danger';
    }
  }

  private performOrderAction(
    orderAction: Observable<ResponseModel>,
    successMessage: string
  ) {
    this.loadingOverlayService.show();
    orderAction.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => {
        this.notificationService.showNotification({
          severity: 'success',
          summary: 'Success',
          detail: successMessage,
        });
        this.fetchOrders();
      },
      error: () => {
        this.loadingOverlayService.hide();
        this.notificationService.showNotification({
          severity: 'error',
          summary: 'Error',
          detail: 'An error happened',
        });
      },
    });
  }

  public confirmOrder(order_code: string) {
    this.performOrderAction(
      this.orderService.confirmOrder(order_code),
      'Order has been confirmed'
    );
  }

  public cancelOrder(order_code: string) {
    this.performOrderAction(
      this.orderService.cancelOrder(order_code),
      'Order has been cancelled'
    );
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
