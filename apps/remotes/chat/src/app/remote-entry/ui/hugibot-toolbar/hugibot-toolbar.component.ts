import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { ChatService } from '../../service/chat.service';
import { ButtonModule } from 'primeng/button';
import { InputTextareaModule } from 'primeng/inputtextarea';
import {
  trigger,
  state,
  style,
  transition,
  animate,
} from '@angular/animations';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ims-hugibot-toolbar',
  standalone: true,
  imports: [
    CommonModule,
    ToolbarModule,
    ChipModule,
    TabViewModule,
    ButtonModule,
    FormsModule,
    InputTextareaModule,
  ],
  template: `<p-button
      [icon]="showToolbar ? 'pi pi-search' : 'pi pi-bars'"
      [label]="showToolbar ? 'Free question' : 'Recommend question'"
      iconPos="right"
      styleClass="p-button-info mb-2"
      (click)="toggleFreeText()"
    ></p-button>
    <div [@toggleAnimation]="showInput ? 'show' : 'hide'">
      <form (ngSubmit)="submitForm()">
        <textarea
          rows="4"
          cols="30"
          pInputTextarea
          [autoResize]="true"
          class="w-full"
          [(ngModel)]="userInput"
          [ngModelOptions]="{ standalone: true }"
          (keydown.enter)="onEnter($event)"
        ></textarea>
      </form>
    </div>
    <div
      class="overflow-auto border-solid border-2 border-[#263238]"
      [@toolbarAnimation]="showToolbar ? 'show' : 'hide'"
    >
      <p-tabView>
        <p-tabPanel *ngFor="let tab of tabs" [header]="tab.header">
          <div class="flex align-items-center gap-2">
            <p-chip
              *ngFor="let question of tab.questions; let qIndex = index"
              [label]="question.label"
              icon="pi pi-question-circle"
              styleClass="cursor-pointer"
              (click)="outputQuestion(question.label)"
            ></p-chip>
          </div>
        </p-tabPanel>
      </p-tabView>
    </div> `,
  styles: [],
  animations: [
    trigger('toolbarAnimation', [
      state(
        'hide',
        style({
          height: '0',
          opacity: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'show',
        style({
          height: '*',
          opacity: '1',
        })
      ),
      transition('hide <=> show', [animate('300ms ease-in-out')]),
    ]),
    trigger('toggleAnimation', [
      state(
        'hide',
        style({
          height: '0',
          opacity: '0',
          overflow: 'hidden',
        })
      ),
      state(
        'show',
        style({
          height: '*',
          opacity: '1',
        })
      ),
      transition('hide <=> show', [animate('300ms ease-in-out')]),
    ]),
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HugibotToolbarComponent {
  readonly chatService = inject(ChatService);

  showToolbar = true;
  showInput = false;
  userInput = '';

  tabs = [
    {
      header: 'Product Availability',
      questions: [
        { label: 'Is product X available?' },
        { label: 'Can I check the availability of Y?' },
        { label: 'Do you have product Z in stock?' },
      ],
    },
    {
      header: 'Stock Quantity',
      questions: [
        { label: 'How many units of X do you have?' },
        { label: 'What is the stock level of Y?' },
        { label: 'Can you tell me how many Z are left?' },
      ],
    },
    {
      header: 'Reordering',
      questions: [
        { label: 'Are we running low on product X?' },
        { label: "Could you check if it's time to reorder Y?" },
        { label: 'Suggest products that need to be restocked.' },
      ],
    },
    {
      header: 'Product Details',
      questions: [
        { label: 'Are we running low on product X?' },
        { label: "Could you check if it's time to reorder Y?" },
        { label: 'Suggest products that need to be restocked.' },
      ],
    },
    {
      header: 'Price and Discounts',
      questions: [
        { label: 'Are we running low on product X?' },
        { label: "Could you check if it's time to reorder Y?" },
        { label: 'Suggest products that need to be restocked.' },
      ],
    },
    {
      header: 'Out of Stock Handling',
      questions: [
        { label: 'Are we running low on product X?' },
        { label: "Could you check if it's time to reorder Y?" },
        { label: 'Suggest products that need to be restocked.' },
      ],
    },
  ];

  public onEnter(event: any): void {
    event.preventDefault();
    if (this.userInput.trim() !== '') {
      this.submitForm();
    }
  }

  public submitForm(): void {
    this.chatService.sendMessageAndReceiveResponse(this.userInput);
    this.userInput = '';
  }

  public outputQuestion(question: string) {
    this.chatService.sendMessageAndReceiveResponse(question);
  }

  public toggleFreeText() {
    this.showInput = !this.showInput;
    this.showToolbar = !this.showToolbar;
  }
}
