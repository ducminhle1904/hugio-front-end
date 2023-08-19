import { ChangeDetectionStrategy, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChartModule } from 'primeng/chart';
import { DropdownModule } from 'primeng/dropdown';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'ims-sales-chart',
  standalone: true,
  imports: [CommonModule, ChartModule, DropdownModule, FormsModule],
  template: `<div class="flex items-center justify-between">
      <div class="flex items-center gap-4">
        <i
          class="pi pi-chart-line text-green-400"
          style="font-size: 2.5rem"
        ></i>
        <p class="text-4xl">$10.552,40</p>
        <span class="text-green-400"
          ><i class="pi pi-check mr-1"></i>8.30%</span
        >
      </div>
      <div>
        <p-dropdown
          [options]="months"
          [(ngModel)]="selectedMonth"
          optionLabel="name"
        ></p-dropdown>
      </div>
    </div>
    <div>
      <p-chart type="line" [data]="data" [options]="options"></p-chart>
    </div>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SalesChartComponent implements OnInit {
  public data: any;
  public options: any;
  public months = [
    { name: 'January' },
    { name: 'February' },
    { name: 'March' },
    { name: 'April' },
    { name: 'May' },
    { name: 'June' },
    { name: 'July' },
    { name: 'August' },
    { name: 'September' },
    { name: 'October' },
    { name: 'November' },
    { name: 'December' },
  ];
  public selectedMonth: string | undefined;

  ngOnInit() {
    const documentStyle = getComputedStyle(document.documentElement);
    const textColor = documentStyle.getPropertyValue('--text-color');
    const textColorSecondary = documentStyle.getPropertyValue(
      '--text-color-secondary'
    );
    const surfaceBorder = documentStyle.getPropertyValue('--surface-border');

    this.data = {
      labels: ['January', 'February', 'March', 'April', 'May', 'June', 'July'],
      datasets: [
        {
          label: 'Sales',
          data: [65, 59, 80, 81, 56, 55, 40],
          fill: true,
          borderColor: documentStyle.getPropertyValue('--green-500'),
          tension: 0.4,
        },
        {
          label: 'Order',
          data: [28, 48, 40, 19, 86, 27, 90],
          fill: true,
          borderColor: documentStyle.getPropertyValue('--orange-500'),
          tension: 0.4,
        },
      ],
    };

    this.options = {
      maintainAspectRatio: false,
      aspectRatio: 0.6,
      plugins: {
        legend: {
          labels: {
            color: textColor,
          },
        },
      },
      scales: {
        x: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
        y: {
          ticks: {
            color: textColorSecondary,
          },
          grid: {
            color: surfaceBorder,
            drawBorder: false,
          },
        },
      },
    };
  }
}
