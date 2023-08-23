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
      <p-card header="Messages" class="w-1/4"> </p-card>
      <p-card header="Hugi Bot" class="w-3/4 fade-element" [@fadeIn]>
        <div class="flex flex-col">
          <div
            *ngFor="let message of chatMessages"
            class="mb-5 flex gap-2 items-center"
            [ngClass]="{
              'self-end': message.isUser,
              'self-start': !message.isUser
            }"
          >
            <p-avatar icon="pi pi-android" *ngIf="!message.isUser"></p-avatar>
            <p-chip
              [label]="message.text"
              [styleClass]="message.isUser ? 'bg-blue-600' : 'bg-yellow-600'"
            ></p-chip>
            <p-avatar icon="pi pi-user" *ngIf="message.isUser"></p-avatar>
          </div>
        </div>
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
  public questions = ['Question 1', 'Question 2', 'Question 3'];
  public chatMessages: { text: string; isUser: boolean }[] = [
    { text: 'Hello! How can I assist you?', isUser: false },
    { text: "I'd like to check the availability of product A.", isUser: true },
    { text: 'Sure! Let me check that for you.', isUser: false },
    { text: 'Product A is currently in stock.', isUser: false },
    { text: 'Great! How about product B?', isUser: true },
    {
      text: 'Unfortunately, product B is currently out of stock.',
      isUser: false,
    },
    { text: 'Got it. Can you recommend an alternative?', isUser: true },
    {
      text: 'Certainly! You might be interested in product C as an alternative.',
      isUser: false,
    },
    { text: 'Thanks for the suggestion.', isUser: true },
    {
      text: "You're welcome! If you have any more questions, feel free to ask.",
      isUser: false,
    },
  ];
  public selectedQuestion = '';

  public selectQuestion(question: string) {
    this.selectedQuestion = question;
    this.chatMessages.push({ text: question, isUser: true });

    // this.chatService.getChatResponse(question).subscribe((response) => {
    //   this.chatMessages.push({ text: response.answer, isUser: false });
    // });
  }
}
