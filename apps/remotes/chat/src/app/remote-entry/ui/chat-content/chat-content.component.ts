import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AvatarModule } from 'primeng/avatar';
import { ChipModule } from 'primeng/chip';

@Component({
  selector: 'ims-chat-content',
  standalone: true,
  imports: [CommonModule, AvatarModule, ChipModule],
  template: `<div class="flex flex-col">
    <div
      *ngFor="let message of chatMessages"
      class="mb-5 flex gap-2 items-center"
      [ngClass]="{
        'self-end': message.isUser,
        'self-start': !message.isUser
      }"
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
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatContentComponent {
  public chatMessages: { text: string; isUser: boolean }[] = [
    { text: 'Hello! How can I assist you?', isUser: false },
  ];
}
