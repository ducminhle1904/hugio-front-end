import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { ChipModule } from 'primeng/chip';
import { TabViewModule } from 'primeng/tabview';

@Component({
  selector: 'ims-hugibot-toolbar',
  standalone: true,
  imports: [CommonModule, ToolbarModule, ChipModule, TabViewModule],
  template: `<p class="font-bold">Choose topic you want to know</p>
    <p-toolbar styleClass="overflow-auto">
      <p-tabView>
        <p-tabPanel *ngFor="let tab of tabs" [header]="tab.header">
          <div class="flex align-items-center gap-2">
            <p-chip
              *ngFor="let question of tab.questions; let qIndex = index"
              [label]="question.label"
              icon="pi pi-question-circle"
              styleClass="cursor-pointer"
            ></p-chip>
          </div>
        </p-tabPanel>
      </p-tabView>
    </p-toolbar>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class HugibotToolbarComponent {
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
}
