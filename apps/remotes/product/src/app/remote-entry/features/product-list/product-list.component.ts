import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { RatingModule } from 'primeng/rating';
import { TagModule } from 'primeng/tag';
import { ButtonModule } from 'primeng/button';
import { ProductService } from '../../services/product.service';
import { Product } from '@ims/core';
import { FormsModule } from '@angular/forms';
import { ChipModule } from 'primeng/chip';
import { MenuItem } from 'primeng/api';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ProductDialogComponent } from '../../components/product-dialog/product-dialog.component';

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
    DynamicDialogModule,
  ],
  template: ` <p-toast styleClass="toast"></p-toast>
    <p-card
      header="Product List"
      subheader="Take control of your inventory, prices, and insights with our intuitive product list management tools."
      styleClass="h-full"
    >
      <div class="card">
        <p-table [value]="products" styleClass="p-datatable-sm">
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
              <td>{{ product.price | currency : 'USD' }}</td>
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
                    (click)="updateProduct()"
                  ></p-button>
                  <p-confirmPopup [key]="product.product_uid"></p-confirmPopup>
                  <p-button
                    icon="pi pi-trash"
                    styleClass="p-button-sm p-button-danger"
                    (click)="confirm($event, product.product_uid)"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-card>`,
  styles: [],
  providers: [ConfirmationService, MessageService, DialogService],
})
export class ProductListComponent implements OnInit {
  readonly productService = inject(ProductService);
  readonly confirmationService = inject(ConfirmationService);
  readonly messageService = inject(MessageService);
  readonly dialogService = inject(DialogService);

  public products: Product[] = [];
  public items: MenuItem[] | undefined;

  dialogRef: DynamicDialogRef | undefined;

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
        this.productService.deleteProduct(product_uid).subscribe({
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
    this.dialogRef = this.dialogService.open(ProductDialogComponent, {
      header: 'Create a Product',
      width: '40vw',
      contentStyle: { overflow: 'auto' },
    });

    this.dialogRef.onClose.subscribe((successCreate: boolean) => {
      if (successCreate) {
        this.messageService.add({
          severity: 'success',
          summary: 'Success',
          detail: 'Create product successfully',
        });
      }
    });
  }

  public updateProduct() {
    console.log('updateProduct');
  }

  private fetchProducts(): void {
    this.productService.queryListProduct().subscribe((data) => {
      this.products = data.response.content;
    });
  }
}
