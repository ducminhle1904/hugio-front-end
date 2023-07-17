import { Component, OnInit } from '@angular/core';
import {
  UntypedFormBuilder,
  UntypedFormGroup,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { UserService } from '@ims/core';

@Component({
  selector: 'ims-auth-entry',
  template: `
    <div class="h-screen flex items-center justify-center">
      <nz-card style="width:300px;" nzTitle="Login">
        <form
          nz-form
          [formGroup]="validateForm"
          class="login-form"
          (ngSubmit)="submitForm()"
        >
          <nz-form-item>
            <nz-form-control nzErrorTip="Please input your username!">
              <nz-input-group nzPrefixIcon="user">
                <input
                  type="text"
                  nz-input
                  formControlName="username"
                  placeholder="Username"
                />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>
          <nz-form-item>
            <nz-form-control nzErrorTip="Please input your Password!">
              <nz-input-group nzPrefixIcon="lock">
                <input
                  type="password"
                  nz-input
                  formControlName="password"
                  placeholder="Password"
                />
              </nz-input-group>
            </nz-form-control>
          </nz-form-item>
          <button
            nz-button
            class="login-form-button login-form-margin"
            [nzType]="'primary'"
          >
            Log in
          </button>
        </form>
      </nz-card>
    </div>
  `,
  styles: [
    `
      .login-form-margin {
        margin-bottom: 16px;
      }

      .login-form-button {
        width: 100%;
      }
    `,
  ],
})
export class RemoteEntryComponent implements OnInit {
  validateForm!: UntypedFormGroup;

  constructor(
    private fb: UntypedFormBuilder,
    private userService: UserService,
    private router: Router
  ) {
    this.userService.isAuthenticated.subscribe((isAuthenticated) => {
      if (isAuthenticated) {
        this.router.navigate(['/app/remotes-summary']);
        return false;
      }
      return true;
    });
  }

  ngOnInit(): void {
    this.validateForm = this.fb.group({
      username: [null, [Validators.required]],
      password: [null, [Validators.required]],
    });
  }

  submitForm(): void {
    if (this.validateForm.valid) {
      this.userService.login(this.validateForm.value).subscribe({
        next: (res) => {
          console.log(res);
        },
        error: (e) => {
          console.log(e);
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
}
