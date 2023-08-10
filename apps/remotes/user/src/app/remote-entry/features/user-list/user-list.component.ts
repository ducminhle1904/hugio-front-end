import { Component, OnInit, ViewChild, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import { DialogModule } from 'primeng/dialog';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { FormsModule } from '@angular/forms';
import { ConfirmationService, MessageService } from 'primeng/api';
import { UserService } from '../../services/user.service';
import { User } from '@ims/core';
import { ButtonModule } from 'primeng/button';
import { TagModule } from 'primeng/tag';
import { UserDialogComponent } from '../../components/user-dialog/user-dialog.component';

@Component({
  selector: 'ims-user-list',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    TableModule,
    ToastModule,
    DialogModule,
    ConfirmPopupModule,
    FormsModule,
    ButtonModule,
    TagModule,
    UserDialogComponent,
  ],
  template: `<p-toast styleClass="toast"></p-toast>
    <p-dialog
      [header]="modalType === 'Create' ? 'Create user' : 'Update user'"
      [(visible)]="modalVisible"
      [modal]="true"
      (onHide)="onHideModal()"
    >
      <ims-user-dialog
        [modalType]="modalType"
        [formData]="updateUserData"
        (closeModal)="closeModal($event)"
        #dialog
      ></ims-user-dialog>
    </p-dialog>
    <p-card header="User List" styleClass="h-full">
      <div class="card">
        <p-table [value]="users" styleClass="p-datatable-sm">
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
              <td>{{ user.user_name }}</td>
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
                <div class="flex gap-1">
                  <p-button
                    icon="pi pi-pencil"
                    styleClass="p-button-sm p-button-info"
                    (click)="updateUser(user)"
                  ></p-button>
                  <p-confirmPopup [key]="user.user_uid"></p-confirmPopup>
                  <p-button
                    icon="pi pi-trash"
                    styleClass="p-button-sm p-button-danger"
                    (click)="confirm($event, user.userUid)"
                  ></p-button>
                </div>
              </td>
            </tr>
          </ng-template>
        </p-table>
      </div>
    </p-card>`,
  styles: [],
  providers: [ConfirmationService, MessageService],
})
export class UserListComponent implements OnInit {
  readonly userService = inject(UserService);
  readonly confirmationService = inject(ConfirmationService);
  readonly messageService = inject(MessageService);

  @ViewChild('dialog') userDialog: UserDialogComponent | undefined;

  public users: User[] = [];
  public modalType = 'Create';
  public modalVisible = false;
  public updateUserData: any;

  ngOnInit(): void {
    this.fetchUsers();
  }

  public createUser() {
    this.modalVisible = true;
    this.modalType = 'Create';
  }

  public updateUser(user: User) {
    this.modalVisible = true;
    this.modalType = 'Update';
    this.updateUserData = user;
  }

  public closeModal(state: boolean) {
    if (state) {
      this.modalVisible = false;
      this.fetchUsers();
    }
  }

  public onHideModal() {
    this.userDialog?.clearForm();
    this.updateUserData = {};
  }

  public confirm(event: Event, user_uid: string) {
    this.confirmationService.confirm({
      target: event.target as EventTarget,
      message: 'Are you sure that you want to proceed?',
      icon: 'pi pi-exclamation-triangle',
      key: user_uid,
      acceptButtonStyleClass: 'p-button-warning',
      accept: () => {
        this.userService.deleteUser(user_uid).subscribe({
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
    this.userService
      .queryListUser()
      .subscribe((data) => (this.users = data.response.content));
  }
}
