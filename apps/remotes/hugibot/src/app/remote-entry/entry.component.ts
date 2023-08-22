import {
  animate,
  state,
  style,
  transition,
  trigger,
} from '@angular/animations';
import { Component } from '@angular/core';

@Component({
  selector: 'ims-remotes-hugibot-entry',
  template: `<div
      class="flex flex-col items-center justify-center h-full fade-element"
      [@fadeOut]
      *ngIf="!startChat"
    >
      <h1 class="font-extrabold text-5xl">WELCOME TO HUGIBOT</h1>
      <p-image
        src="/assets/images/hugibot.png"
        alt="Image"
        width="250"
      ></p-image>
      <blockquote
        class="text-xl italic font-semibold text-gray-900 dark:text-white w-[500px] text-center mb-4"
      >
        <p>
          "Streamline Your Stock with Our Inventory Chatbot: Effortless
          Management at Your Fingertips!"
        </p>
      </blockquote>
      <button
        pButton
        pRipple
        label="Started"
        class="p-button-success"
        (click)="chat()"
      ></button>
    </div>

    <div
      class="relative mx-auto border-[#161d21] dark:border-[#161d21] bg-[#161d21] border-[14px] rounded-[2.5rem] h-full w-[80%] fade-element"
      *ngIf="startChat"
      [@fadeIn]
    >
      <div
        class="h-[32px] w-[3px] bg-[#161d21] dark:bg-[#161d21] absolute -left-[17px] top-[72px] rounded-l-lg"
      ></div>
      <div
        class="h-[46px] w-[3px] bg-[#161d21] dark:bg-[#161d21] absolute -left-[17px] top-[124px] rounded-l-lg"
      ></div>
      <div
        class="h-[46px] w-[3px] bg-[#161d21] dark:bg-[#161d21] absolute -left-[17px] top-[178px] rounded-l-lg"
      ></div>
      <div
        class="h-[64px] w-[3px] bg-[#161d21] dark:bg-[#161d21] absolute -right-[17px] top-[142px] rounded-r-lg"
      ></div>
      <div
        class="rounded-[2rem] overflow-hidden h-full bg-white dark:bg-[#161d21] flex flex-col p-2"
      >
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
    </div> `,
  styles: [
    `
      .fade-element {
        transition: opacity 0.3s;
      }
      .question-list {
        display: flex;
        flex-direction: column;
        max-width: 200px;
      }

      .question-list div {
        background-color: lightgray;
        margin: 5px;
        padding: 10px;
        cursor: pointer;
      }

      .chat-container {
        margin-top: 20px;
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
  public startChat = false;
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

  public chat() {
    this.startChat = true;
  }

  public selectQuestion(question: string) {
    this.selectedQuestion = question;
    this.chatMessages.push({ text: question, isUser: true });

    // this.chatService.getChatResponse(question).subscribe((response) => {
    //   this.chatMessages.push({ text: response.answer, isUser: false });
    // });
  }
}
