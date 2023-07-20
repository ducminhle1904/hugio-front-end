import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ProductTableComponent } from '@ims/ui';

@Component({
  selector: 'ims-product-list',
  standalone: true,
  imports: [CommonModule, ProductTableComponent],
  templateUrl: './product-list.component.html',
  styleUrls: ['./product-list.component.scss'],
})
export class ProductListComponent {}
