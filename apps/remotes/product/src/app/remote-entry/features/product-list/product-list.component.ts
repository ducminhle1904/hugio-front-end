import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { NotificationService, Product } from '@ims/core';
import { ConfirmationService, MenuItem } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ChipModule } from 'primeng/chip';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { DialogModule } from 'primeng/dialog';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ProductDialogComponent } from '../../components/product-dialog/product-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '@ims/data-access';
import { LoadingOverlayService } from '@ims/shared';

@Component({
  selector: 'ims-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    TagModule,
    ButtonModule,
    FormsModule,
    ChipModule,
    ConfirmPopupModule,
    ProductDialogComponent,
    DynamicDialogModule,
    DialogModule,
  ],
  template: ` <p-dialog
      header="QR code"
      [(visible)]="qrCodeModal"
      [style]="{ width: '250px' }"
      ><img
        [src]="qrImage"
        alt="Base64 Image"
        class="w-full h-full object-contain"
    /></p-dialog>
    <p-card header="Product List" styleClass="h-full">
      <p-table
        [value]="products"
        styleClass="p-datatable-sm"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        [rowsPerPageOptions]="[10, 25, 50]"
        [scrollable]="true"
        scrollHeight="'100%'"
      >
        <ng-template pTemplate="caption">
          <p-button
            icon="pi pi-plus"
            label="Add product"
            styleClass="p-button-sm p-button-raised p-button-secondary mb-3"
            (click)="createProduct()"
          ></p-button>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th>Name</th>
            <th>Fee</th>
            <th>Sale Price</th>
            <th>Category</th>
            <th>Quantity</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product>
          <tr>
            <td>{{ product.product_name }}</td>
            <td>
              {{ product.fee | currency : 'VND' : 'symbol-narrow' : '1.0-0' }}
            </td>
            <td>
              {{ product.price | currency : 'VND' : 'symbol-narrow' : '1.0-0' }}
            </td>
            <td>
              <ng-container *ngFor="let category of product.categories">
                <p-chip
                  [label]="category.category_name"
                  styleClass="mx-1"
                ></p-chip>
              </ng-container>
            </td>
            <td>
              {{ product.product_quantity }}
            </td>
            <td>
              <p-tag
                [value]="quantityText(product.product_quantity)"
                [severity]="quantityStatus(product.product_quantity)"
              ></p-tag>
            </td>
            <td>
              <div class="flex gap-1">
                <p-button
                  icon="pi pi-pencil"
                  styleClass="p-button-sm p-button-info"
                  (click)="updateProduct(product)"
                ></p-button>
                <p-confirmPopup [key]="product.product_uid"></p-confirmPopup>
                <p-button
                  icon="pi pi-trash"
                  styleClass="p-button-sm p-button-danger"
                  (click)="confirm($event, product.product_uid)"
                ></p-button>
                <p-button
                  icon="pi pi-qrcode"
                  styleClass="p-button-sm p-button-danger"
                  (click)="viewQrCode(product.product_uid)"
                ></p-button>
              </div>
            </td>
          </tr>
        </ng-template>
      </p-table>
    </p-card>`,
  styles: [
    `
      ::ng-deep .p-datatable-wrapper {
        height: calc(100% - 120px);
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
  providers: [ConfirmationService, DialogService],
})
export class ProductListComponent implements OnInit, OnDestroy {
  readonly productService = inject(ProductService);
  readonly confirmationService = inject(ConfirmationService);
  readonly dialogService = inject(DialogService);
  readonly destroyRef = inject(DestroyRef);
  readonly loadingOverlayService = inject(LoadingOverlayService);
  readonly notificationService = inject(NotificationService);

  public products: Product[] = [];
  public items: MenuItem[] | undefined;
  public qrCodeModal = false;
  public qrImage = '';

  private ref: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.fetchProducts();
  }

  public quantityStatus(quantity: number): string {
    if (quantity > 10) {
      return 'success';
    } else if (quantity < 10) {
      return 'warning';
    } else {
      return 'danger';
    }
  }

  public quantityText(quantity: number): string {
    if (quantity > 10) {
      return 'INSTOCK';
    } else if (quantity <= 10 && quantity > 0) {
      return 'LOWSTOCK';
    } else {
      return 'OUTOFSTOCK';
    }
  }

  public confirm(event: Event, product_uid: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      key: product_uid,
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.productService
          .deleteProduct(product_uid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.notificationService.showNotification({
                severity: 'info',
                summary: 'Delete successfully',
                detail: 'Product have been deleted',
              });
              this.fetchProducts();
            },
            error: (e) => {
              this.notificationService.showNotification({
                severity: 'error',
                summary: 'Error happend',
                detail: e,
              });
            },
          });
      },
      reject: () => {
        this.notificationService.showNotification({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  public createProduct() {
    this.ref = this.dialogService.open(ProductDialogComponent, {
      header: 'Create Product',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        type: 'Create',
      },
    });

    this.ref.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success: boolean) => {
        if (success) {
          this.notificationService.showNotification({
            severity: 'info',
            summary: 'Successfully',
            detail: 'Product have been created',
          });
          this.fetchProducts();
        }
      });
  }

  public updateProduct(product: Product) {
    this.ref = this.dialogService.open(ProductDialogComponent, {
      header: 'Update Product',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        type: 'Update',
        data: product,
      },
    });

    this.ref.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success: boolean) => {
        if (success) {
          this.notificationService.showNotification({
            severity: 'info',
            summary: 'Successfully',
            detail: 'Product have been updated',
          });
          this.fetchProducts();
        }
      });
  }

  public viewQrCode(product_uid: string) {
    this.loadingOverlayService.show();
    this.productService
      .getProductQr(product_uid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (res) => {
          this.qrImage = 'data:image/png;base64,' + res.response;
          this.qrCodeModal = true;
          this.loadingOverlayService.hide();
        },
        error: () => {
          this.loadingOverlayService.hide();
          this.notificationService.showNotification({
            severity: 'error',
            summary: 'Failed',
            detail: 'Fail to fetch QR code',
          });
        },
      });
  }

  private fetchProducts(): void {
    this.loadingOverlayService.show();
    this.productService
      .queryListProduct()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.loadingOverlayService.hide();
          this.products = data.response.content;
        },
        error: () => {
          this.loadingOverlayService.hide();
        },
      });
  }

  ngOnDestroy(): void {
    this.loadingOverlayService.hide();
  }
}
