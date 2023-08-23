import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'ims-remotes-chat-entry',
  template: `
    <div class="flex gap-4 h-full">
      <p-card header="Messages" class="w-1/4">
        <ims-user-bar (target)="fetchUserChat($event)"></ims-user-bar>
      </p-card>
      <p-card header="HugiBot" class="w-3/4 fade-element relative" [@fadeIn]>
        <ims-chat-content></ims-chat-content>
        <ng-template pTemplate="footer">
          <ims-hugibot-toolbar></ims-hugibot-toolbar>
        </ng-template>
      </p-card>
    </div>
  `,
  styles: [
    `
      .fade-element {
        transition: opacity 0.3s;
      }
      :host ::ng-deep .p-card {
        height: 100%;
      }
      :host ::ng-deep .p-card-body {
        height: 100%;
      }
      :host ::ng-deep .p-card-content {
        height: calc(100% - 235px);
      }
    `,
  ],
  animations: [
    trigger('fadeOut', [
      state('void', style({ opacity: 0 })),
      transition(':leave', [animate(300)]),
    ]),
    trigger('fadeIn', [
      state('void', style({ opacity: 0 })),
      transition(':enter', [animate(300)]),
    ]),
  ],
})
export class RemoteEntryComponent {
  public selectedQuestion = '';

  public selectQuestion(question: string) {
    this.selectedQuestion = question;
  }

  public fetchUserChat(user: string) {
    console.log(user);
  }
}
