import { CommonModule } from '@angular/common';
import { Component, Input, OnDestroy, OnInit, inject } from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { NzFormModule } from 'ng-zorro-antd/form';
import { NzIconModule } from 'ng-zorro-antd/icon';
import { NzInputModule } from 'ng-zorro-antd/input';
import { NzInputNumberModule } from 'ng-zorro-antd/input-number';
import { NzMessageModule, NzMessageService } from 'ng-zorro-antd/message';
import { NzSelectModule } from 'ng-zorro-antd/select';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { NzModalRef } from 'ng-zorro-antd/modal';
import { NzButtonModule } from 'ng-zorro-antd/button';
import { Category, Product } from '@ims/core';
import { ProductService } from '@ims/data-access';

@Component({
  selector: 'ims-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    NzIconModule,
    NzInputModule,
    NzFormModule,
    NzSelectModule,
    NzInputNumberModule,
    NzMessageModule,
    NzButtonModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  template: `
    <form nz-form [formGroup]="validateForm">
      <nz-form-item class="justify-between">
        <nz-form-label
          class="text-left"
          [nzSm]="10"
          [nzXs]="24"
          nzFor="nickname"
          nzRequired
        >
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
        <nz-form-label
          class="text-left"
          [nzSm]="10"
          [nzXs]="24"
          nzFor="price"
          nzRequired
        >
          <span>Product price</span>
        </nz-form-label>
        <nz-form-control
          [nzSm]="14"
          [nzXs]="24"
          nzErrorTip="Please input product price!"
        >
          <nz-input-number
            id="price"
            formControlName="price"
            [nzMin]="1"
            [nzMax]="10000"
            [nzStep]="1"
            [nzFormatter]="formatterDollar"
            [nzParser]="parserDollar"
            class="w-full"
          ></nz-input-number>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item class="justify-between">
        <nz-form-label
          class="text-left"
          [nzSm]="10"
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
          class="text-left"
          [nzSm]="10"
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
          <nz-input-number
            id="product_quantity"
            formControlName="product_quantity"
            [nzMin]="1"
            [nzMax]="1000"
            [nzStep]="1"
            class="w-full"
          ></nz-input-number>
        </nz-form-control>
      </nz-form-item>
      <nz-form-item class="justify-between">
        <nz-form-label
          class="text-left"
          [nzSm]="10"
          [nzXs]="24"
          nzFor="category"
          nzRequired
        >
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
            class="w-full"
          >
            <nz-option
              *ngFor="let item of listOfCategory"
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
    <div class="flex gap-2 justify-end">
      <button nz-button nzType="default" (click)="onClose()">Cancel</button>
      <button
        nz-button
        nzType="primary"
        (click)="handleSubmit()"
        class="flex items-center mb-2"
      >
        {{ modalType }} Product
      </button>
    </div>
  `,
  styles: [],
})
export class ProductDialogComponent implements OnInit, OnDestroy {
  // fb = inject(UntypedFormBuilder);
  productService = inject(ProductService);
  messageService = inject(NzMessageService);
  modalRef = inject(NzModalRef<ProductDialogComponent>);

  @Input() productData!: Product;
  @Input() modalType = 'Create';

  constructor(private fb: UntypedFormBuilder) {}

  public validateForm!: UntypedFormGroup;

  public formatterDollar = (value: number): string => `$ ${value}`;
  public parserDollar = (value: string): string => value.replace('$ ', '');

  public listOfCategory: Category[] = [];

  private unsubscribe$: Subject<void> = new Subject<void>();

  ngOnInit(): void {
    this.initForm(this.productData);
    this.getListCategory();
  }

  public handleSubmit(): void {
    if (this.validateForm.valid) {
      if (this.modalType === 'Create') {
        this.handleCreate();
      } else {
        this.handleUpdate();
      }
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  public onClose() {
    this.modalRef.close();
  }

  private handleCreate() {
    this.productService
      .createProduct(this.validateForm.value)
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.codeNumber === 0) {
            this.messageService.create(
              'success',
              'Create product successfully'
            );
            this.modalRef.close(true);
          }
        },
        error: () => {
          this.messageService.create(
            'error',
            'There was an Error, please contact administrator'
          );
        },
      });
  }

  private handleUpdate() {
    this.productService
      .updateProduct({
        ...this.validateForm.value,
        product_uid: this.productData.product_uid,
      })
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe({
        next: (res) => {
          if (res.codeNumber === 0) {
            this.messageService.create(
              'success',
              'Update product successfully'
            );
            this.modalRef.close(true);
          }
        },
        error: () => {
          this.messageService.create(
            'error',
            'There was an Error, please contact administrator'
          );
        },
      });
  }

  private initForm(productData: Product): void {
    if (productData && this.modalType === 'Update') {
      this.validateForm = this.fb.group({
        name: [productData?.product_name || null, [Validators.required]],
        price: [productData?.price || 100, [Validators.required]],
        product_description: [
          productData?.product_description || null,
          [Validators.required],
        ],
        product_quantity: [
          productData?.product_quantity || 1,
          [Validators.required],
        ],
        category: [
          productData?.categories.map((category) => category.category_name) ||
            null,
          [Validators.required],
        ],
      });
    } else {
      this.validateForm = this.fb.group({
        name: [null, [Validators.required]],
        price: [100, [Validators.required]],
        product_description: [null, [Validators.required]],
        product_quantity: [1, [Validators.required]],
        category: [null, [Validators.required]],
      });
    }
  }

  private getListCategory() {
    this.productService
      .queryListCategory()
      .pipe(takeUntil(this.unsubscribe$))
      .subscribe((data) => {
        this.listOfCategory = data;
      });
  }

  ngOnDestroy() {
    this.unsubscribe$.next();
    this.unsubscribe$.complete();
  }
}
