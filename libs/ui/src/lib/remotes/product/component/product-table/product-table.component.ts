import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { LoadingService, Product } from '@ims/core';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalRef, NzModalService } from 'ng-zorro-antd/modal';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { Observable } from 'rxjs';
import { ProductService } from '../../service/product.service';
import { ProductDialogComponent } from '../create-product/create-product.component';
import { NzEmptyModule } from 'ng-zorro-antd/empty';

@Component({
  selector: 'ims-product-table',
  standalone: true,
  imports: [
    CommonModule,
    NzTableModule,
    NzDropDownModule,
    NzIconModule,
    NzTagModule,
    NzModalModule,
    NzNotificationModule,
    NzButtonModule,
    NzEmptyModule,
  ],
  template: ` <button
      nz-button
      nzType="primary"
      (click)="showModal()"
      class="flex items-center mb-2"
    >
      <span nz-icon nzType="plus" nzTheme="outline"></span>
      Create Product
    </button>
    <ng-container *ngIf="listOfProduct$ | async as products">
      <ng-container *ngIf="products.length > 0; else emptyComponent">
        <nz-table #basicTable [nzData]="products">
          <thead>
            <tr>
              <th>Name</th>
              <th>Price</th>
              <th>Discount</th>
              <th>Status</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            <tr *ngFor="let data of basicTable.data">
              <td>{{ data.product_name }}</td>
              <td>{{ data.price }}</td>
              <td>{{ data.discount }}</td>
              <td>
                <nz-tag [nzColor]="data.active ? '#87d068' : '#f50'">{{
                  data.active ? 'Active' : 'Inactive'
                }}</nz-tag>
              </td>
              <td>
                <button
                  nz-button
                  nz-dropdown
                  [nzDropdownMenu]="menu1"
                  nzPlacement="bottomRight"
                  nzTrigger="click"
                >
                  <span nz-icon nzType="ellipsis"></span>
                </button>
                <nz-dropdown-menu #menu1="nzDropdownMenu">
                  <ul nz-menu>
                    <li
                      nz-menu-item
                      class="flex items-center"
                      style="gap: 8px"
                      (click)="handleEdit()"
                    >
                      <span nz-icon nzType="edit" nzTheme="outline"></span>Edit
                    </li>
                    <li
                      nz-menu-item
                      class="flex items-center"
                      style="gap: 8px"
                      (click)="handleDelete(data)"
                    >
                      <span nz-icon nzType="delete" nzTheme="outline"></span
                      >Delete
                    </li>
                  </ul>
                </nz-dropdown-menu>
              </td>
            </tr>
          </tbody>
        </nz-table>
      </ng-container>
    </ng-container>
    <ng-template #emptyComponent>
      <nz-empty></nz-empty>
    </ng-template>`,
  styles: [],
})
export class ProductTableComponent implements OnInit {
  productService = inject(ProductService);
  modalService = inject(NzModalService);
  notiService = inject(NzNotificationService);
  loadingService = inject(LoadingService);

  public listOfProduct$!: Observable<Product[]>;
  public loading$ = this.loadingService.isLoading();

  ngOnInit(): void {
    this.getListProduct();
  }

  public showModal() {
    const modalRef: NzModalRef = this.modalService.create({
      nzTitle: 'Create product',
      nzContent: ProductDialogComponent,
      nzFooter: null,
    });
    modalRef.afterClose.subscribe((isSuccessCreate) => {
      isSuccessCreate && this.getListProduct();
    });
  }

  public handleEdit() {
    console.log('edit');
  }

  public handleDelete(product: Product) {
    this.modalService.confirm({
      nzTitle: `Are you sure delete product: ${product.product_name}?`,
      nzOkText: 'Yes',
      nzOkType: 'primary',
      nzOkDanger: true,
      nzOnOk: () => this.deleteProduct(product.product_uid),
      nzCancelText: 'Cancel',
      nzOnCancel: () => console.log('Cancel'),
    });
  }

  private getListProduct() {
    this.listOfProduct$ = this.productService.queryListProduct();
  }

  private deleteProduct(product_id: string) {
    this.productService.deleteProduct(product_id).subscribe({
      next: () => {
        this.notiService.create(
          'success',
          'Delete product successfully',
          'Success'
        );
        this.getListProduct();
      },
      error: () => {
        this.notiService.create('error', 'Fail to delete product', 'Failed');
      },
    });
  }
}
