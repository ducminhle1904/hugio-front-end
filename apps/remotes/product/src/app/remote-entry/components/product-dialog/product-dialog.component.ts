import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { InputTextModule } from 'primeng/inputtext';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { ProductService } from '../../services/product.service';
import { Observable } from 'rxjs';
import { Category } from '@ims/core';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogRef } from 'primeng/dynamicdialog';

@Component({
  selector: 'ims-product-dialog',
  standalone: true,
  imports: [
    CommonModule,
    InputTextModule,
    InputNumberModule,
    MultiSelectModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
  ],
  template: `<form nz-form [formGroup]="validateForm" (ngSubmit)="submitForm()">
    <div class="flex flex-col gap-5">
      <div class="flex gap-3">
        <div class="flex flex-col gap-1 w-1/2">
          <label htmlFor="name" class="block text-gray-300 text-sm font-bold"
            >Name</label
          >
          <input
            pInputText
            id="name"
            aria-describedby="name-help"
            formControlName="name"
          />
        </div>
        <div class="flex flex-col gap-1 w-1/2">
          <label
            htmlFor="description"
            class="block text-gray-300 text-sm font-bold"
            >Description</label
          >
          <input
            pInputText
            id="description"
            aria-describedby="description-help"
            formControlName="product_description"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <div class="flex flex-col gap-1 w-1/2">
          <label htmlFor="price" class="block text-gray-300 text-sm font-bold"
            >Price</label
          >
          <p-inputNumber
            inputId="price"
            formControlName="price"
            styleClass="w-full"
          ></p-inputNumber>
        </div>
        <div class="flex flex-col gap-1 w-1/2">
          <label
            htmlFor="discount"
            class="block text-gray-300 text-sm font-bold"
            >Discount</label
          >
          <p-inputNumber
            inputId="discount"
            formControlName="discount"
            styleClass="w-full"
          ></p-inputNumber>
        </div>
      </div>

      <div class="flex gap-3">
        <div class="flex flex-col gap-1 w-1/2">
          <label
            htmlFor="quantity"
            class="block text-gray-300 text-sm font-bold"
            >Quantity</label
          >
          <p-inputNumber
            inputId="quantity"
            formControlName="product_quantity"
            styleClass="w-full"
          ></p-inputNumber>
        </div>
        <div
          class="flex flex-col gap-1 w-1/2"
          *ngIf="categories$ | async as categories"
        >
          <label
            htmlFor="categories"
            class="block text-gray-300 text-sm font-bold"
            >Categories</label
          >
          <p-multiSelect
            [options]="categories"
            formControlName="category"
            optionLabel="category_name"
            id="categories"
            styleClass="w-full"
            optionValue="category_name"
          ></p-multiSelect>
        </div>
      </div>
      <p-button
        label="Create"
        type="submit"
        styleClass="p-button-success"
      ></p-button>
    </div>
  </form> `,
  styles: [],
  providers: [DynamicDialogRef],
})
export class ProductDialogComponent implements OnInit {
  readonly fb = inject(UntypedFormBuilder);
  readonly productService = inject(ProductService);
  readonly dialogRef = inject(DynamicDialogRef);

  readonly categories$: Observable<Category[]> =
    this.productService.queryListCategory();

  validateForm!: UntypedFormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  public submitForm(): void {
    if (this.validateForm.valid) {
      this.productService.createProduct(this.validateForm.value).subscribe({
        next: () => {
          this.dialogRef.close();
        },
        error: () => {
          this.dialogRef.close(false);
        },
      });
    } else {
      Object.values(this.validateForm.controls).forEach((control) => {
        if (control.invalid) {
          control.markAsDirty();
          control.updateValueAndValidity({ onlySelf: true });
        }
      });
    }
  }

  private initForm() {
    this.validateForm = this.fb.group({
      name: [null, [Validators.required]],
      product_description: [null, [Validators.required]],
      price: [null, [Validators.required]],
      discount: [null, [Validators.required]],
      product_quantity: [null, [Validators.required]],
      category: [null, [Validators.required]],
    });
  }
}
