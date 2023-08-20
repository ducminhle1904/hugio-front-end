import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { remoteRoutes } from './entry.routes';
import { CardModule } from 'primeng/card';
import { FormsModule } from '@angular/forms';
import { SalesChartComponent } from './ui/sales-chart/sales-chart.component';
import { OrderStatisticComponent } from './ui/order-statistic/order-statistic.component';

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(remoteRoutes),
    CardModule,
    FormsModule,
    SalesChartComponent,
    OrderStatisticComponent,
  ],
  providers: [],
})
export class RemoteEntryModule {}
