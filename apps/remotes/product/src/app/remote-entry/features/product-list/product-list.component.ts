import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Product } from '@ims/core';
import { ConfirmationService, MenuItem, MessageService } from 'primeng/api';
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
import { RatingModule } from 'primeng/rating';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { ProductDialogComponent } from '../../components/product-dialog/product-dialog.component';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { ProductService } from '@ims/data-access';

@Component({
  selector: 'ims-product-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    RatingModule,
    TagModule,
    ButtonModule,
    FormsModule,
    ChipModule,
    ConfirmPopupModule,
    ToastModule,
    ProductDialogComponent,
    DynamicDialogModule,
    DialogModule,
  ],
  template: ` <p-toast styleClass="toast"></p-toast>
    <p-dialog header="QR code" [(visible)]="qrCodeModal"> </p-dialog>
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
            <th>Price</th>
            <th>Category</th>
            <th>Reviews</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-product>
          <tr>
            <td>{{ product.product_name }}</td>
            <td>{{ product.price | currency : 'USD' : 'symbol' : '1.0-0' }}</td>
            <td>
              <ng-container *ngFor="let category of product.categories">
                <p-chip
                  [label]="category.category_name"
                  styleClass="mx-1"
                ></p-chip>
              </ng-container>
            </td>
            <td>
              <p-rating
                [ngModel]="product.rating"
                [readonly]="true"
                [cancel]="false"
              ></p-rating>
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
  providers: [ConfirmationService, MessageService, DialogService],
})
export class ProductListComponent implements OnInit {
  readonly productService = inject(ProductService);
  readonly confirmationService = inject(ConfirmationService);
  readonly messageService = inject(MessageService);
  readonly dialogService = inject(DialogService);
  readonly destroyRef = inject(DestroyRef);

  public products: Product[] = [];
  public items: MenuItem[] | undefined;
  public qrCodeModal = false;

  private ref: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.fetchProducts();
  }

  public quantityStatus(quantity: number): string {
    if (quantity > 100) {
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
              this.messageService.add({
                severity: 'info',
                summary: 'Delete successfully',
                detail: 'Product have been deleted',
              });
              this.fetchProducts();
            },
            error: (e) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error happend',
                detail: e,
              });
            },
          });
      },
      reject: () => {
        this.messageService.add({
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
          this.messageService.add({
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
          this.messageService.add({
            severity: 'info',
            summary: 'Successfully',
            detail: 'Product have been updated',
          });
          this.fetchProducts();
        }
      });
  }

  public viewQrCode(product_uid: string) {
    this.qrCodeModal = true;
    this.productService
      .getProductQr(product_uid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((res) => console.log(res));
  }

  private fetchProducts(): void {
    this.productService
      .queryListProduct()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.products = data.response.content;
      });
  }
}
