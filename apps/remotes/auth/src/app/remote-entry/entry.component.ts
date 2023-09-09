import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { Router } from '@angular/router';
import { NotificationService, UserService } from '@ims/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';

@Component({
  selector: 'ims-auth-entry',
  template: ` <div
    class="flex flex-col items-center justify-center px-6 py-8 mx-auto md:h-screen lg:py-0"
  >
    <a
      href="#"
      class="flex items-center mb-6 text-2xl font-semibold text-gray-900 dark:text-white"
    >
      <img
        class="w-8 h-8 mr-2"
        src="https://flowbite.s3.amazonaws.com/blocks/marketing-ui/logo.svg"
        alt="logo"
      />
      IMS
    </a>
    <div
      class="w-full bg-white rounded-lg shadow dark:border md:mt-0 sm:max-w-md xl:p-0 dark:bg-gray-800 dark:border-gray-700"
    >
      <div class="p-6 space-y-4 md:space-y-6 sm:p-8">
        <h1
          class="text-xl font-bold leading-tight tracking-tight text-gray-900 md:text-2xl dark:text-white"
        >
          Sign in to your account
        </h1>
        <form
          class="space-y-4 md:space-y-6"
          [formGroup]="validateForm"
          (ngSubmit)="submitForm()"
        >
          <div>
            <label
              htmlFor="username"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Username</label
            >
            <input
              pInputText
              id="username"
              aria-describedby="username-help"
              formControlName="username"
              class="w-full"
            />
          </div>
          <div>
            <label
              for="password"
              class="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >Password</label
            >
            <p-password
              id="password"
              formControlName="password"
              [toggleMask]="true"
              [style]="{ width: '100%' }"
              [inputStyle]="{ width: '100%' }"
            ></p-password>
          </div>
          <div class="flex items-center justify-between">
            <div class="flex items-center gap-1">
              <p-checkbox
                formControlName="remember"
                [binary]="true"
                inputId="remember"
              ></p-checkbox>
              <label
                for="remember"
                class="text-sm font-medium text-primary-600 dark:text-primary-500"
                >Remember me</label
              >
            </div>

            <a
              href="#"
              class="text-sm font-medium text-primary-600 hover:underline dark:text-primary-500"
              >Forgot password?</a
            >
          </div>
          <p-button
            label="Sign in"
            type="submit"
            styleClass="p-button-success"
            [loading]="isLoading"
          ></p-button>
        </form>
      </div>
    </div>
  </div>`,
  styles: [``],
  encapsulation: ViewEncapsulation.None,
})
export class RemoteEntryComponent implements OnInit {
  validateForm!: UntypedFormGroup;
  isLoading = false;

  constructor(
    private userService: UserService,
    private router: Router,
    private fb: UntypedFormBuilder,
    private notificationService: NotificationService
  ) {
    this.userService.isAuthenticated.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/remotes-summary']);
        return false;
      }
      return true;
    });
  }

  ngOnInit(): void {
    this.initForm();
  }

  public submitForm(): void {
    if (this.validateForm.valid) {
      this.isLoading = true;
      this.userService.login(this.validateForm.value).subscribe({
        next: (res) => {
          console.log(res);
          this.isLoading = false;
        },
        error: (e) => {
          console.log(e);

          this.notificationService.showNotification({
            severity: 'error',
            summary: 'Error',
            detail: e.message,
          });
          this.isLoading = false;
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
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
      remember: [true],
    });
  }
}
