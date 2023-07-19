import {
  ChangeDetectionStrategy,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { NzModalModule } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzSelectModule } from 'ng-zorro-antd/select';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { ProductService } from '../../service/product.service';
import { Category } from '@ims/core';

@Component({
  selector: 'ims-create-product',
  standalone: true,
  imports: [
    CommonModule,
    NzModalModule,
    NzButtonModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `<button
      nz-button
      nzType="primary"
      (click)="showModal()"
      class="flex items-center"
    >
      <span nz-icon nzType="plus" nzTheme="outline"></span>
      Create Product
    </button>
    <nz-modal
      [(nzVisible)]="isVisible"
      nzTitle="Create new product"
      (nzOnCancel)="handleCancel()"
      (nzOnOk)="handleOk()"
      [nzOkLoading]="isOkLoading"
    >
      <form nz-form [formGroup]="validateForm" *nzModalContent>
        <nz-form-item class="justify-between">
          <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="nickname" nzRequired>
            <span>Product name</span>
          </nz-form-label>
          <nz-form-control
            [nzSm]="14"
            [nzXs]="24"
            nzErrorTip="Please input product name!"
          >
            <input nz-input id="name" formControlName="name" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item class="justify-between">
          <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="price" nzRequired>
            <span>Product price</span>
          </nz-form-label>
          <nz-form-control
            [nzSm]="14"
            [nzXs]="24"
            nzErrorTip="Please input product price!"
          >
            <input nz-input id="price" formControlName="price" />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item class="justify-between">
          <nz-form-label
            [nzSm]="6"
            [nzXs]="24"
            nzFor="product_description"
            nzRequired
          >
            <span>Product description</span>
          </nz-form-label>
          <nz-form-control
            [nzSm]="14"
            [nzXs]="24"
            nzErrorTip="Please input product description!"
          >
            <input
              nz-input
              id="product_description"
              formControlName="product_description"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item class="justify-between">
          <nz-form-label
            [nzSm]="6"
            [nzXs]="24"
            nzFor="product_quantity"
            nzRequired
          >
            <span>Product quantity</span>
          </nz-form-label>
          <nz-form-control
            [nzSm]="14"
            [nzXs]="24"
            nzErrorTip="Please input product quantity!"
          >
            <input
              nz-input
              id="product_quantity"
              formControlName="product_quantity"
            />
          </nz-form-control>
        </nz-form-item>
        <nz-form-item
          class="justify-between"
          *ngIf="listOfCategory$ | async as categories"
        >
          <nz-form-label [nzSm]="6" [nzXs]="24" nzFor="category" nzRequired>
            <span>Product category</span>
          </nz-form-label>
          <nz-form-control
            [nzSm]="14"
            [nzXs]="24"
            nzErrorTip="Please choose product category!"
          >
            <nz-select
              [nzMaxTagCount]="3"
              [nzMaxTagPlaceholder]="tagPlaceHolder"
              nzMode="multiple"
              nzPlaceHolder="Please select category"
              id="category"
              formControlName="category"
            >
              <nz-option
                *ngFor="let item of categories"
                [nzLabel]="item.category_name"
                [nzValue]="item.category_name"
              ></nz-option>
            </nz-select>
            <ng-template #tagPlaceHolder let-selectedList
              >and {{ selectedList.length }} more selected</ng-template
            >
          </nz-form-control>
        </nz-form-item>
      </form>
    </nz-modal> `,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class CreateProductComponent implements OnInit {
  fb = inject(UntypedFormBuilder);
  productService = inject(ProductService);

  isVisible = false;
  isOkLoading = false;
  validateForm!: UntypedFormGroup;

  listOfCategory$ = this.productService.queryListCategory();

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      price: [null, [Validators.required]],
      product_description: [null, [Validators.required]],
      product_quantity: [null, [Validators.required]],
      category: [null, [Validators.required]],
      details: [null, [Validators.required]],
    });
  }

  showModal(): void {
    this.isVisible = true;
  }

  handleOk(): void {
    this.isOkLoading = true;
    if (this.validateForm.valid) {
      console.log('submit', this.validateForm.value);
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  handleCancel(): void {
    this.isVisible = false;
  }
}
