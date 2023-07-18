import { Component, inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzTableModule } from 'ng-zorro-antd/table';
import { NzDividerModule } from 'ng-zorro-antd/divider';
import { ProductService } from '../../service/product.service';
import { first } from 'rxjs';

interface Person {
  key: string;
  name: string;
  age: number;
  address: string;
}

@Component({
  selector: 'ims-product-table',
  standalone: true,
  imports: [CommonModule, NzTableModule, NzDividerModule],
  template: `<nz-table #basicTable [nzData]="listOfProduct">
    <thead>
      <tr>
        <th>Name</th>
        <th>Age</th>
        <th>Address</th>
        <th>Action</th>
      </tr>
    </thead>
    <tbody>
      <tr *ngFor="let data of basicTable.data">
        <td>{{ data.name }}</td>
        <td>{{ data.age }}</td>
        <td>{{ data.address }}</td>
        <td>
          <a>Action 一 {{ data.name }}</a>
          <nz-divider nzType="vertical"></nz-divider>
          <a>Delete</a>
        </td>
      </tr>
    </tbody>
  </nz-table>`,
  styles: [],
})
export class ProductTableComponent implements OnInit {
  productService = inject(ProductService);
  listOfProduct: any[] = [];

  ngOnInit(): void {
    this.getListProduct();
  }

  private getListProduct() {
    this.productService
      .queryListProduct()
      .pipe(first())
      .subscribe((data) => (this.listOfProduct = data));
  }

  listOfData: Person[] = [
    {
      key: '1',
      name: 'John Brown',
      age: 32,
      address: 'New York No. 1 Lake Park',
    },
    {
      key: '2',
      name: 'Jim Green',
      age: 42,
      address: 'London No. 1 Lake Park',
    },
    {
      key: '3',
      name: 'Joe Black',
      age: 32,
      address: 'Sidney No. 1 Lake Park',
    },
  ];
}
