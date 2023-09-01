import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnDestroy,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { HasRoleDirective, NotificationService, User } from '@ims/core';
import { ConfirmationService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { Table, TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { ChipModule } from 'primeng/chip';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '@ims/data-access';
import { LoadingOverlayService } from '@ims/shared';
import { EmployeeDialogComponent } from '../../components/employee-dialog/employee-dialog.component';
import { InputTextModule } from 'primeng/inputtext';

@Component({
  selector: 'ims-employee-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ConfirmPopupModule,
    FormsModule,
    ButtonModule,
    TagModule,
    DynamicDialogModule,
    ChipModule,
    InputTextModule,
    HasRoleDirective,
  ],
  template: ` <p-card header="Employee List" styleClass="h-full">
    <p-table
      #employeeTable
      [value]="users"
      styleClass="p-datatable-sm"
      [paginator]="true"
      [rows]="10"
      [showCurrentPageReport]="true"
      currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
      [rowsPerPageOptions]="[10, 25, 50]"
      [scrollable]="true"
      scrollHeight="'100%'"
      [globalFilterFields]="['full_name', 'email', 'phone_number', 'address']"
    >
      <ng-template pTemplate="caption">
        <div class="flex items-center justify-between">
          <p-button
            *appHasRole="'ADMIN'"
            icon="pi pi-plus"
            label="Add employee"
            styleClass="p-button-sm p-button-raised p-button-secondary mb-3"
            (click)="addEmployee()"
          ></p-button>
          <span class="p-input-icon-left ml-auto">
            <i class="pi pi-search"></i>
            <input
              pInputText
              type="text"
              placeholder="Search employee"
              [(ngModel)]="globalFilter"
              (input)="applyGlobalFilter()"
            />
          </span>
        </div>
      </ng-template>
      <ng-template pTemplate="header">
        <tr>
          <th>Full Name</th>
          <th>Email</th>
          <th>Phone</th>
          <th>Address</th>
          <th>Role</th>
          <th>Status</th>
          <th *appHasRole="'ADMIN'">Action</th>
        </tr>
      </ng-template>
      <ng-template pTemplate="body" let-user>
        <tr>
          <td>{{ user.full_name }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.phone_number }}</td>
          <td>{{ user.address }}</td>
          <td>
            <ng-container *ngFor="let role of user.roles">
              <p-chip [label]="role" styleClass="mx-1"></p-chip>
            </ng-container>
          </td>
          <td>
            <p-tag
              [value]="user.active ? 'Active' : 'Inactive'"
              [severity]="user.active ? 'success' : 'danger'"
            ></p-tag>
          </td>
          <td *appHasRole="'ADMIN'">
            <div class="flex gap-1" *ngIf="user.active; else reactive">
              <p-button
                icon="pi pi-pencil"
                styleClass="p-button-sm p-button-info"
                (click)="updateUser(user)"
              ></p-button>
              <p-confirmPopup [key]="user.user_uid"></p-confirmPopup>
              <p-button
                icon="pi pi-trash"
                styleClass="p-button-sm p-button-danger"
                (click)="confirm($event, user.user_uid)"
              ></p-button>
            </div>
            <ng-template #reactive>
              <p-button
                icon="pi pi-replay"
                styleClass="p-button-sm p-button-success"
                (click)="activeUser(user.user_uid)"
              ></p-button>
            </ng-template>
          </td>
        </tr>
      </ng-template>
      <ng-template pTemplate="emptymessage">
        <tr>
          <td colspan="7">No employee found.</td>
        </tr>
      </ng-template>
    </p-table>
  </p-card>`,
  styles: [
    `
      :host ::ng-deep .p-datatable-wrapper {
        height: calc(100% - 120px);
      }
      :host ::ng-deep .p-card-body {
        height: 100%;
      }
      :host ::ng-deep .p-card-content {
        height: 95%;
      }
      :host ::ng-deep .p-datatable {
        height: 100%;
      }
    `,
  ],
  encapsulation: ViewEncapsulation.Emulated,
  providers: [ConfirmationService, DialogService],
})
export class EmployeeListComponent implements OnInit, OnDestroy {
  readonly userService = inject(UserService);
  readonly confirmationService = inject(ConfirmationService);
  readonly dialogService = inject(DialogService);
  readonly destroyRef = inject(DestroyRef);
  readonly loadingOverlayService = inject(LoadingOverlayService);
  readonly notificationService = inject(NotificationService);

  @ViewChild('employeeTable') employeeTable!: Table;

  public users: User[] = [];
  public globalFilter = '';
  private ref: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.fetchEmployees();
  }

  public applyGlobalFilter() {
    this.employeeTable.filterGlobal(this.globalFilter, 'contains');
  }

  public addEmployee() {
    this.ref = this.dialogService.open(EmployeeDialogComponent, {
      header: 'Add new employee',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        type: 'Create',
      },
    });

    this.ref.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success: boolean) => {
        if (success) {
          this.notificationService.showNotification({
            severity: 'info',
            summary: 'Successfully',
            detail: 'User have been created',
          });
          this.fetchEmployees();
        }
      });
  }

  public updateUser(user: User) {
    this.ref = this.dialogService.open(EmployeeDialogComponent, {
      header: 'Update employee',
      contentStyle: { overflow: 'auto' },
      baseZIndex: 10000,
      data: {
        type: 'Update',
        data: user,
      },
    });

    this.ref.onClose
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((success: boolean) => {
        if (success) {
          this.notificationService.showNotification({
            severity: 'info',
            summary: 'Successfully',
            detail: 'User have been updated',
          });
          this.fetchEmployees();
        }
      });
  }

  public activeUser(user_uid: string) {
    this.userService
      .activeUser(user_uid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.notificationService.showNotification({
            severity: 'info',
            summary: 'Successfully',
            detail: 'User have been activate',
          });
          this.fetchEmployees();
        },
        error: (e) => {
          console.log(e);
        },
      });
  }

  public confirm(event: Event, user_uid: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      key: user_uid,
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.userService
          .deleteUser(user_uid)
          .pipe(takeUntilDestroyed(this.destroyRef))
          .subscribe({
            next: () => {
              this.notificationService.showNotification({
                severity: 'info',
                summary: 'Delete successfully',
                detail: 'User have been deleted',
              });
              this.fetchEmployees();
            },
            error: (e) => {
              this.notificationService.showNotification({
                severity: 'error',
                summary: 'Error happend',
                detail: e,
              });
            },
          });
      },
    });
  }

  private fetchEmployees() {
    this.loadingOverlayService.show();
    this.userService
      .queryListUser('user')
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.users = data.response.content;
        this.loadingOverlayService.hide();
      });
  }

  ngOnDestroy(): void {
    this.loadingOverlayService.hide();
  }
}
