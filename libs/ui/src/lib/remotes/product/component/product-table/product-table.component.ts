import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { ProductService } from '../../service/product.service';
import { first } from 'rxjs';
import { Product } from '@ims/core';
import { NzDropDownModule } from 'ng-zorro-antd/dropdown';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzTagModule } from 'ng-zorro-antd/tag';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzModalService } from 'ng-zorro-antd/modal';
import { NzNotificationModule } from 'ng-zorro-antd/notification';
import { NzNotificationService } from 'ng-zorro-antd/notification';

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
  ],
  template: `<nz-table #basicTable [nzData]="listOfProduct">
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
                <span nz-icon nzType="delete" nzTheme="outline"></span>Delete
              </li>
            </ul>
          </nz-dropdown-menu>
        </td>
      </tr>
    </tbody>
  </nz-table>`,
  styles: [],
})
export class ProductTableComponent implements OnInit {
  productService = inject(ProductService);
  modalService = inject(NzModalService);
  notiService = inject(NzNotificationService);

  listOfProduct: Product[] = [];

  ngOnInit(): void {
    this.getListProduct();
  }

  public handleEdit() {}

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
    this.productService
      .queryListProduct()
      .pipe(first())
      .subscribe((data) => (this.listOfProduct = data.response.content));
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
