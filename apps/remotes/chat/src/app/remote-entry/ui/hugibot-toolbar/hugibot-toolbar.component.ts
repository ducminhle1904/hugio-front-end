import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';
import { ToolbarModule } from 'primeng/toolbar';
import { ChatService } from '../../service/chat.service';
import { ButtonModule } from 'primeng/button';
import { InputTextModule } from 'primeng/inputtext';
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
    InputTextModule,
    FormsModule,
  ],
  template: `<p class="font-bold">Choose topic you want to know</p>
    <p-toolbar styleClass="overflow-auto">
      <div [@toolbarAnimation]="showToolbar ? 'show' : 'hide'">
        <p-tabView>
          <p-tabPanel *ngFor="let tab of tabs" [header]="tab.header">
            <div class="flex align-items-center gap-2">
              <p-chip
                *ngFor="let question of tab.questions; let qIndex = index"
                [label]="question.label"
                icon="pi pi-question-circle"
                styleClass="cursor-pointer"
                (click)="outputQuestion(question.label, question.data)"
              ></p-chip>
            </div>
          </p-tabPanel>
        </p-tabView>
      </div>
      <div [@toggleAnimation]="showInput ? 'show' : 'hide'">
        <span class="p-input-icon-left">
          <i class="pi pi-search"></i>
          <input type="text" pInputText [(ngModel)]="inputText" />
        </span>
      </div>

      <div class="p-toolbar-group-end">
        <p-button
          [icon]="showToolbar ? 'pi pi-search' : 'pi pi-bars'"
          [label]="showToolbar ? 'Free question' : 'Recommend question'"
          iconPos="right"
          styleClass="p-button-info"
          (click)="toggleFreeText()"
        ></p-button>
      </div>
    </p-toolbar>`,
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
  inputText = '';

  tabs = [
    {
      header: 'Product Statistic',
      questions: [
        { label: 'Please give me statistics for today?', data: 'ps1' },
        { label: 'Please give me statistics for this month?', data: 'ps2' },
      ],
    },
    {
      header: 'Sales performance',
      questions: [
        {
          label: 'Which products should not be imported next month?',
          data: 'sp1',
        },
        {
          label: 'Which products should be imported more of next month?',
          data: 'sp2',
        },
      ],
    },
  ];

  public outputQuestion(question: string, code: string) {
    this.chatService.sendMessageAndReceiveResponse(question, code);
  }

  public toggleFreeText() {
    this.showInput = !this.showInput;
    this.showToolbar = !this.showToolbar;
  }
}
