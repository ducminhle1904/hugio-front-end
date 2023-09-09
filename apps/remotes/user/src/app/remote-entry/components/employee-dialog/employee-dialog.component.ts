import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { UserService } from '@ims/data-access';
import { ButtonModule } from 'primeng/button';
import { DynamicDialogConfig, DynamicDialogRef } from 'primeng/dynamicdialog';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { Observable } from 'rxjs';

@Component({
  selector: 'ims-employee-dialog',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    ReactiveFormsModule,
    ButtonModule,
    InputTextModule,
    MultiSelectModule,
  ],
  template: `<form [formGroup]="validateForm" (ngSubmit)="submitForm()">
    <div class="flex flex-col gap-5">
      <div class="flex gap-3">
        <div class="flex flex-col gap-1 w-1/2">
          <label
            htmlFor="username"
            class="block text-gray-300 text-sm font-bold"
            >User Name</label
          >
          <input
            pInputText
            id="username"
            aria-describedby="username-help"
            formControlName="username"
          />
        </div>
        <div class="flex flex-col gap-1 w-1/2">
          <label
            htmlFor="full_name"
            class="block text-gray-300 text-sm font-bold"
            >Full Name</label
          >
          <input
            pInputText
            id="full_name"
            aria-describedby="full_name-help"
            formControlName="full_name"
          />
        </div>
      </div>
      <div class="flex gap-3">
        <div class="flex flex-col gap-1 w-1/2">
          <label htmlFor="email" class="block text-gray-300 text-sm font-bold"
            >Email</label
          >
          <input
            pInputText
            id="email"
            aria-describedby="email-help"
            formControlName="email"
          />
        </div>
        <div class="flex flex-col gap-1 w-1/2">
          <label htmlFor="address" class="block text-gray-300 text-sm font-bold"
            >Address</label
          >
          <input
            pInputText
            id="address"
            aria-describedby="address-help"
            formControlName="address"
          />
        </div>
      </div>

      <div class="flex gap-3">
        <div class="flex flex-col gap-1 w-1/2">
          <label
            htmlFor="phone_number"
            class="block text-gray-300 text-sm font-bold"
            >Phone number</label
          >
          <input
            pInputText
            id="phone_number"
            aria-describedby="phone_number-help"
            formControlName="phone_number"
          />
        </div>
        <div class="flex flex-col gap-1 w-1/2" *ngIf="roles$ | async as roles">
          <label htmlFor="roles" class="block text-gray-300 text-sm font-bold"
            >Roles</label
          >
          <p-multiSelect
            [options]="roles"
            formControlName="roles"
            id="roles"
            styleClass="w-full"
            appendTo="body"
          ></p-multiSelect>
        </div>
      </div>

      <p-button
        [label]="modalType"
        type="submit"
        styleClass="p-button-success"
        [loading]="isLoading"
      ></p-button>
    </div>
  </form>`,
  styles: [],
})
export class EmployeeDialogComponent implements OnInit {
  readonly fb = inject(UntypedFormBuilder);
  readonly userService = inject(UserService);
  readonly ref = inject(DynamicDialogRef);
  readonly destroyRef = inject(DestroyRef);

  public modalType = 'Create';
  public isLoading = false;

  readonly roles$: Observable<string[]> = this.userService.queryListRole();

  validateForm!: UntypedFormGroup;

  constructor(public modalConfig: DynamicDialogConfig) {}

  ngOnInit(): void {
    this.initForm();
    this.modalType = this.modalConfig.data.type;
    if (this.modalConfig.data.data) {
      const user = this.modalConfig.data.data;
      this.validateForm.patchValue(user);
    }
  }

  public submitForm(): void {
    if (!this.validateForm.valid) {
      this.markFormControlsAsDirty();
      return;
    }

    this.isLoading = true;
    this.validateForm.disable();

    const formValue = this.validateForm.value;
    const userServiceMethod =
      this.modalType === 'Create' ? 'createUser' : 'editUser';
    const userServiceCall =
      userServiceMethod === 'createUser'
        ? this.userService.createUser(formValue)
        : this.userService.editUser({
            ...formValue,
            user_uid: this.modalConfig.data.data.user_uid,
            roles: ['CUSTOMER'],
          });

    userServiceCall.pipe(takeUntilDestroyed(this.destroyRef)).subscribe({
      next: () => this.handleSuccess(),
      error: (e) => this.handleError(e),
    });
  }

  private markFormControlsAsDirty(): void {
    Object.values(this.validateForm.controls).forEach((control) => {
      if (control.invalid) {
        control.markAsDirty();
        control.updateValueAndValidity({ onlySelf: true });
      }
    });
  }

  private handleSuccess(): void {
    this.validateForm.reset();
    this.isLoading = false;
    this.ref.close(true);
  }

  private handleError(error: any): void {
    console.log(error);
    this.validateForm.enable();
    this.isLoading = false;
  }

  private initForm() {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      full_name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      phone_number: [null, [Validators.required]],
      address: [null, [Validators.required]],
      roles: [null, [Validators.required]],
    });
  }
}
