import { CommonModule } from '@angular/common';
import { Component, inject, OnInit, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';
import { LoadingService, Product } from '@ims/core';
import { ProductService } from '@ims/web/product/data-access';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzDrawerModule } from 'ng-zorro-antd/drawer';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzModalModule, NzModalService } from 'ng-zorro-antd/modal';
import {
  NzNotificationModule,
  NzNotificationService,
} from 'ng-zorro-antd/notification';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { distinctUntilChanged } from 'rxjs';
import { RouterModule } from '@angular/router';

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
    NzDrawerModule,
    RouterModule,
  ],
  template: `
    <button
      nz-button
      nzType="primary"
      [routerLink]="['/remotes-product/create']"
      class="flex items-center mb-4"
    >
      <span nz-icon nzType="plus" nzTheme="outline"></span>
      Create Product
    </button>
    <nz-table
      #basicTable
      [nzData]="listOfProduct"
      [nzLoading]="loading$ | async"
    >
      <thead>
        <tr>
          <th>Name</th>
          <th>Price</th>
          <th>Status</th>
          <th>Action</th>
        </tr>
      </thead>
      <tbody>
        <tr *ngFor="let data of basicTable.data">
          <td>{{ data.product_name }}</td>
          <td>{{ data.price }}</td>
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
                  (click)="handleEdit(data)"
                >
                  <span nz-icon nzType="edit" nzTheme="outline"></span>Edit
                </li>
                <li
                  nz-menu-item
                  class="flex items-center"
                  style="gap: 8px"
                  (click)="handleDelete(data)"
                >
                  <span nz-icon nzType="delete" nzTheme="outline"></span>Delete
                </li>
              </ul>
            </nz-dropdown-menu>
          </td>
        </tr>
      </tbody>
    </nz-table>
  `,
  styles: [],
})
export class ProductTableComponent implements OnInit {
  readonly productService = inject(ProductService);
  readonly modalService = inject(NzModalService);
  readonly notiService = inject(NzNotificationService);
  readonly loadingService = inject(LoadingService);
  readonly viewContainerRef = inject(ViewContainerRef);
  readonly router = inject(Router);

  public listOfProduct: Product[] = [];
  public loading$ = this.loadingService.isLoading();

  ngOnInit(): void {
    this.getListProduct();
  }

  public handleEdit(product: Product) {}

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
    this.loadingService.setLoading(true);
    this.productService
      .queryListProduct()
      .pipe(distinctUntilChanged())
      .subscribe((data) => {
        this.listOfProduct = data.response.content;
        this.loadingService.setLoading(false);
      });
  }

  private deleteProduct(product_id: string) {
    this.productService
      .deleteProduct(product_id)
      .pipe(distinctUntilChanged())
      .subscribe({
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
