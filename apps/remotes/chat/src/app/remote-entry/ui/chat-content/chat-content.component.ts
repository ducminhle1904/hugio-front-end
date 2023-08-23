import {
  ChangeDetectionStrategy,
  ChangeDetectorRef,
  Component,
  OnInit,
  inject,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';
import { Chat, ChatService } from '../../service/chat.service';
import { trigger, transition, style, animate } from '@angular/animations';

@Component({
  selector: 'ims-chat-content',
  standalone: true,
  imports: [CommonModule, AvatarModule, ChipModule],
  template: `<div class="flex flex-col">
    <div
      *ngFor="let message of chatMessages; let i = index"
      class="mb-5 flex gap-2 items-center w-1/2"
      [ngClass]="{
        'self-end justify-end': message.isUser,
        'self-start': !message.isUser
      }"
      [@fadeInOut]="i === chatMessages.length - 1 ? 'in' : 'out'"
    >
      <p-avatar
        image="/assets/images/chatgpt.png"
        *ngIf="!message.isUser"
      ></p-avatar>
      <p-chip
        [label]="message.text"
        [styleClass]="message.isUser ? 'bg-blue-600' : 'bg-[#75ac9d]'"
      ></p-chip>
      <p-avatar icon="pi pi-user" *ngIf="message.isUser"></p-avatar>
    </div>
  </div>`,
  styles: [],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({ opacity: 0 }),
        animate('300ms', style({ opacity: 1 })),
      ]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContentComponent implements OnInit {
  readonly chatService = inject(ChatService);
  readonly cdRef = inject(ChangeDetectorRef);

  public chatMessages: Chat[] = [];

  ngOnInit() {
    this.chatService.currentChat.subscribe({
      next: (messages) => {
        console.log(messages);
        this.chatMessages = messages;
        this.cdRef.detectChanges();
      },
      error: (error) => {
        console.error('Error fetching chat messages:', error);
      },
    });
  }
}
