import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CardModule } from 'primeng/card';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'ims-order-statistic',
  standalone: true,
  imports: [CommonModule, CardModule, ButtonModule],
  template: `<p-card [header]="title">
    <p class="font-extrabold text-4xl lg:text-6xl">{{ figure || 0 }}</p>
    <span class="text-green-400"
      ><i class="pi pi-arrow-up mr-1"></i>{{ percent || 0 }}%</span
    ><span> from last month</span>

    <ng-template pTemplate="footer">
      <p-button
        label="View detail"
        icon="pi pi-chevron-right"
        iconPos="right"
        styleClass="p-button-outlined p-button-success"
      ></p-button>
    </ng-template>
  </p-card>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OrderStatisticComponent {
  @Input({ required: true }) title = '';
  @Input() figure: number | string | undefined | null;
  @Input() percent: number | undefined;
}
