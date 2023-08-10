import { CommonModule } from '@angular/common';
import {
  Component,
  EventEmitter,
  Input,
  OnInit,
  Output,
  inject,
} from '@angular/core';
import {
  FormsModule,
  ReactiveFormsModule,
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { User } from '@ims/core';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
import { MultiSelectModule } from 'primeng/multiselect';
import { UserService } from '../../services/user.service';
import { Observable } from 'rxjs';

@Component({
  selector: 'ims-user-dialog',
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
            htmlFor="user_name"
            class="block text-gray-300 text-sm font-bold"
            >User Name</label
          >
          <input
            pInputText
            id="user_name"
            aria-describedby="user_name-help"
            formControlName="user_name"
          />
        </div>
      </div>
      <div class="flex gap-3">
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
      </div>

      <div class="flex gap-3">
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
      ></p-button>
    </div>
  </form>`,
  styles: [],
})
export class UserDialogComponent implements OnInit {
  readonly fb = inject(UntypedFormBuilder);
  readonly userService = inject(UserService);

  private _formData!: User;
  @Input() set formData(value: User) {
    this._formData = value;
    if (this.validateForm && this._formData) {
      this.validateForm.patchValue(this._formData); // Fill in form data
    }
  }
  get formData(): User {
    return this._formData;
  }

  @Input() modalType = 'Create';
  @Output() closeModal = new EventEmitter<boolean>();

  readonly roles$: Observable<string[]> = this.userService.queryListRole();

  validateForm!: UntypedFormGroup;

  ngOnInit(): void {
    this.initForm();
  }

  public submitForm(): void {
    if (this.validateForm.valid) {
      if (this.modalType === 'Create') {
        this.userService.createUser(this.validateForm.value).subscribe({
          next: () => {
            this.validateForm.reset();
            this.closeModal.emit(true);
          },
          error: (e) => {
            console.log(e);
          },
        });
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

  public clearForm() {
    this.validateForm.reset();
  }

  private initForm() {
    this.validateForm = this.fb.group({
      user_name: [null, [Validators.required]],
      full_name: [null, [Validators.required]],
      email: [null, [Validators.required]],
      address: [null, [Validators.required]],
      roles: [null, [Validators.required]],
    });
  }
}
