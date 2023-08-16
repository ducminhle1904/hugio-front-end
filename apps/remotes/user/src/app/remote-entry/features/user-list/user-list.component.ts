import { CommonModule } from '@angular/common';
import {
  Component,
  DestroyRef,
  OnInit,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { FormsModule } from '@angular/forms';
import { User } from '@ims/core';
import { ConfirmationService, MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { TableModule } from 'primeng/table';
import { TagModule } from 'primeng/tag';
import { ToastModule } from 'primeng/toast';
import { UserDialogComponent } from '../../components/user-dialog/user-dialog.component';
import {
  DialogService,
  DynamicDialogModule,
  DynamicDialogRef,
} from 'primeng/dynamicdialog';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { UserService } from '@ims/data-access';
import { LoadingOverlayService } from '@ims/shared';

@Component({
  selector: 'ims-user-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ToastModule,
    ConfirmPopupModule,
    FormsModule,
    ButtonModule,
    TagModule,
    UserDialogComponent,
    DynamicDialogModule,
  ],
  template: `<p-toast styleClass="toast"></p-toast>
    <p-card header="User List" styleClass="h-full">
      <p-table
        [value]="users"
        styleClass="p-datatable-sm"
        [paginator]="true"
        [rows]="10"
        [showCurrentPageReport]="true"
        currentPageReportTemplate="Showing {first} to {last} of {totalRecords} entries"
        [rowsPerPageOptions]="[10, 25, 50]"
        [scrollable]="true"
        scrollHeight="'100%'"
      >
        <ng-template pTemplate="caption">
          <p-button
            icon="pi pi-plus"
            label="Add user"
            styleClass="p-button-sm p-button-raised p-button-secondary mb-3"
            (click)="createUser()"
          ></p-button>
        </ng-template>
        <ng-template pTemplate="header">
          <tr>
            <th>Username</th>
            <th>Full Name</th>
            <th>Email</th>
            <th>Address</th>
            <th>Status</th>
            <th>Action</th>
          </tr>
        </ng-template>
        <ng-template pTemplate="body" let-user>
          <tr>
            <td>{{ user.username }}</td>
            <td>{{ user.full_name }}</td>
            <td>{{ user.email }}</td>
            <td>{{ user.address }}</td>
            <td>
              <p-tag
                [value]="user.active ? 'Active' : 'Inactive'"
                [severity]="user.active ? 'success' : 'danger'"
              ></p-tag>
            </td>
            <td>
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
  providers: [ConfirmationService, MessageService, DialogService],
})
export class UserListComponent implements OnInit {
  readonly userService = inject(UserService);
  readonly confirmationService = inject(ConfirmationService);
  readonly messageService = inject(MessageService);
  readonly dialogService = inject(DialogService);
  readonly destroyRef = inject(DestroyRef);
  readonly loadingOverlayService = inject(LoadingOverlayService);

  public users: User[] = [];
  private ref: DynamicDialogRef | undefined;

  ngOnInit(): void {
    this.fetchUsers();
  }

  public createUser() {
    this.ref = this.dialogService.open(UserDialogComponent, {
      header: 'Create User',
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
          this.messageService.add({
            severity: 'info',
            summary: 'Successfully',
            detail: 'User have been created',
          });
          this.fetchUsers();
        }
      });
  }

  public updateUser(user: User) {
    this.ref = this.dialogService.open(UserDialogComponent, {
      header: 'Update User',
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
          this.messageService.add({
            severity: 'info',
            summary: 'Successfully',
            detail: 'Product have been updated',
          });
          this.fetchUsers();
        }
      });
  }

  public activeUser(user_uid: string) {
    this.userService
      .activeUser(user_uid)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => {
          this.messageService.add({
            severity: 'info',
            summary: 'Successfully',
            detail: 'User have been activate',
          });
          this.fetchUsers();
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
              this.messageService.add({
                severity: 'info',
                summary: 'Delete successfully',
                detail: 'User have been deleted',
              });
              this.fetchUsers();
            },
            error: (e) => {
              this.messageService.add({
                severity: 'error',
                summary: 'Error happend',
                detail: e,
              });
            },
          });
      },
      reject: () => {
        this.messageService.add({
          severity: 'error',
          summary: 'Rejected',
          detail: 'You have rejected',
        });
      },
    });
  }

  private fetchUsers() {
    this.loadingOverlayService.show();
    this.userService
      .queryListUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.users = data.response.content;
        this.loadingOverlayService.hide();
      });
  }
}
