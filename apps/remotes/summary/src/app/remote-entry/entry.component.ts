import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { OrderService } from '@ims/data-access';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { OrderStatisticResponse } from '@ims/core';

@Component({
  selector: 'ims-remotes-summary-entry',
  template: `<div>
    <div class="grid grid-cols-3 gap-4">
      <ims-order-statistic
        [title]="'Total orders'"
        [figure]="statisticData?.response?.total_order_in_month"
      ></ims-order-statistic>
      <ims-order-statistic
        [title]="'Total sales'"
        [figure]="statisticData?.response?.total_sale_in_month"
      ></ims-order-statistic>
      <ims-order-statistic
        [title]="'Cancelled order'"
        [figure]="statisticData?.response?.total_cancel_order"
      ></ims-order-statistic>
    </div>

    <div class="mt-4">
      <p-card header="Sales Chart">
        <ims-sales-chart></ims-sales-chart>
      </p-card>
    </div>
  </div>`,
})
export class RemoteEntryComponent implements OnInit {
  readonly orderService = inject(OrderService);
  readonly destroyRef = inject(DestroyRef);

  public statisticData: OrderStatisticResponse | undefined;

  ngOnInit(): void {
    this.fetchOrderStatistic();
  }

  private fetchOrderStatistic() {
    const body = {
      request: {
        year: 2023,
        month: 8,
      },
    };
    this.orderService
      .queryOrderStatistic(body)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.statisticData = data;
      });
  }
}
