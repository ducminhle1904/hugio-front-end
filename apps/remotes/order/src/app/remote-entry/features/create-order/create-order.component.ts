import { CommonModule, DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  DestroyRef,
  OnInit,
  ViewChild,
  ViewEncapsulation,
  inject,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Product } from '@ims/core';
import { ProductService } from '@ims/data-access';
import {
  CalculateTotalPricePipe,
  closeFullscreen,
  openFullscreen,
} from '@ims/shared';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
import {
  NgxScannerQrcodeModule,
  ScannerQRCodeConfig,
  ScannerQRCodeResult,
  NgxScannerQrcodeComponent,
  NgxScannerQrcodeService,
} from 'ngx-scanner-qrcode';
import { ToolbarComponent } from '../../ui/toolbar/toolbar.component';

@Component({
  selector: 'ims-create-order',
  standalone: true,
  imports: [
    CommonModule,
    CardModule,
    ButtonModule,
    ToastModule,
    MultiSelectModule,
    FormsModule,
    ToolbarComponent,
    TableModule,
    InputNumberModule,
    CheckboxModule,
    DividerModule,
    CalculateTotalPricePipe,
    NgxScannerQrcodeModule,
  ],
  template: `<p-toast styleClass="toast"></p-toast>
    <div class="flex gap-2 h-screen w-screen p-3">
      <div class="w-3/4">
        <p-card styleClass="h-full w-full">
          <div class="flex items-center justify-between">
            <div class="w-1/4">
              <p-multiSelect
                [options]="products"
                [(ngModel)]="selectedProducts"
                defaultLabel="Select products"
                optionLabel="product_name"
                name="fieldName"
                ngDefaultControl
                styleClass="w-full"
              >
                <ng-template let-value pTemplate="selectedItems">
                  <div *ngIf="selectedProducts && selectedProducts.length > 0">
                    <div class="flex gap-2">
                      <ng-container
                        *ngFor="
                          let product of selectedProducts.slice(0, 2);
                          let last = last
                        "
                      >
                        {{ product.product_name }}{{ !last ? ',' : '' }}
                      </ng-container>
                      <div *ngIf="selectedProducts.length > 2">
                        and {{ selectedProducts.length - 2 }} more products
                      </div>
                    </div>
                  </div>

                  <div
                    *ngIf="!selectedProducts || selectedProducts.length === 0"
                  >
                    Select Products
                  </div>
                </ng-template>
                <ng-template let-product pTemplate="item">
                  <div
                    class="flex items-center justify-between gap-2 w-full text-right"
                  >
                    <div>{{ product.product_name }}</div>
                    <div class="flex flex-col">
                      <p>
                        Price:
                        {{
                          product.price | currency : 'USD' : 'symbol' : '1.0-0'
                        }}
                      </p>
                      <p>Quantity: {{ product.stock }}</p>
                    </div>
                  </div>
                </ng-template>
              </p-multiSelect>
            </div>
            <p-button
              icon="pi pi-qrcode"
              styleClass="p-button-info"
              [disabled]="action.isLoading"
              (click)="handle(action, action.isStart ? 'stop' : 'start')"
            ></p-button>
          </div>

          <p-table
            [value]="selectedProducts"
            dataKey="product_uid"
            [scrollable]="true"
            scrollHeight="100%"
            styleClass="p-datatable-gridlines mt-5"
          >
            <ng-template pTemplate="header">
              <tr>
                <th class="w-[10%]">ID</th>
                <th class="w-1/4">Name</th>
                <th class="w-1/4">Quantity</th>
                <th class="w-1/4">Price</th>
                <th class="w-[15%]">Total</th>
              </tr>
            </ng-template>
            <ng-template pTemplate="body" let-product let-editing="editing">
              <tr>
                <td>
                  <div class="flex items-center justify-between">
                    {{ product.id }}
                    <p-button
                      icon="pi pi-trash"
                      styleClass="p-button-danger"
                      (click)="removeProduct(product.product_uid)"
                    ></p-button>
                  </div>
                </td>
                <td>{{ product.product_name }}</td>
                <td
                  [pEditableColumn]="product.product_quantity"
                  pEditableColumnField="product_quantity"
                >
                  <p-cellEditor>
                    <ng-template pTemplate="input">
                      <p-inputNumber
                        [showButtons]="true"
                        inputId="stacked"
                        [min]="1"
                        decrementButtonClass="p-button-danger"
                        incrementButtonClass="p-button-success"
                        [(ngModel)]="product.product_quantity"
                      ></p-inputNumber>
                    </ng-template>
                    <ng-template pTemplate="output">
                      <div class="flex justify-between">
                        {{ product.product_quantity
                        }}<i class="p-toolbar-separator pi pi-pencil ml-2"></i>
                      </div>
                    </ng-template>
                  </p-cellEditor>
                </td>
                <td
                  [pEditableColumn]="product.price"
                  pEditableColumnField="price"
                >
                  <p-cellEditor>
                    <ng-template pTemplate="input">
                      <p-inputNumber
                        [(ngModel)]="product.price"
                        [min]="1"
                      ></p-inputNumber>
                    </ng-template>
                    <ng-template pTemplate="output"
                      ><div class="flex justify-between">
                        {{
                          product.price | currency : 'USD' : 'symbol' : '1.0-0'
                        }}<i
                          class="p-toolbar-separator pi pi-pencil ml-2"
                        ></i></div
                    ></ng-template>
                  </p-cellEditor>
                </td>
                <td class="font-bold">
                  {{
                    product.price * product.product_quantity
                      | currency : 'USD' : 'symbol' : '1.0-0'
                  }}
                </td>
              </tr>
            </ng-template>
          </p-table>

          <ng-template pTemplate="footer"
            ><ims-toolbar (action)="handleAction($event)"></ims-toolbar
          ></ng-template>
        </p-card>
      </div>
      <div class="w-1/4">
        <p-card styleClass="h-full w-full">
          <div>
            <ngx-scanner-qrcode
              #action="scanner"
              [config]="config"
              (event)="onEvent($event, action)"
            ></ngx-scanner-qrcode>
            <p *ngIf="action.isLoading">⌛ Loading...</p>
          </div>
          <div *ngIf="selectedProducts.length > 0">
            <div class="flex items-center gap-2">
              <p-checkbox [binary]="true" inputId="delivery"></p-checkbox>
              <label for="delivery">Delivery</label>
            </div>

            <p-divider></p-divider>

            <div class="flex items-center justify-between">
              <p class="text-2xl">
                Total: ({{ selectedProducts.length }} product)
              </p>
              <p class="text-2xl">
                {{
                  selectedProducts
                    | calculateTotalPrice
                    | currency : 'USD' : 'symbol' : '1.0-0'
                }}
              </p>
            </div>

            <div class="flex items-center justify-between">
              <p class="text-2xl">VAT (10%)</p>
              <p class="text-2xl">
                {{
                  (selectedProducts | calculateTotalPrice) * 0.1
                    | currency : 'USD' : 'symbol' : '1.0-0'
                }}
              </p>
            </div>

            <p-divider></p-divider>

            <div class="flex items-center justify-between">
              <p class="text-2xl">CUSTOMER OWES</p>
              <p class="text-2xl">
                {{
                  (selectedProducts | calculateTotalPrice) +
                    (selectedProducts | calculateTotalPrice) * 0.1
                    | currency : 'USD' : 'symbol' : '1.0-0'
                }}
              </p>
            </div>
          </div>

          <div *ngIf="selectedProducts.length === 0">
            <p>No products selected.</p>
          </div>

          <ng-template pTemplate="footer">
            <div class="p-4">
              <p-button
                label="Create order"
                styleClass="p-button-info w-full"
              ></p-button>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div> `,
  styles: [
    `
      ::ng-deep .p-card .p-card-body {
        height: 100%;
      }
      ::ng-deep .p-card .p-card-content {
        height: 90%;
        padding: unset;
      }
      ::ng-deep .p-datatable {
        height: 90%;
      }
    `,
  ],
  providers: [MessageService, NgxScannerQrcodeService],
  encapsulation: ViewEncapsulation.Emulated,
})
export class CreateOrderComponent implements OnInit, AfterViewInit {
  readonly productService = inject(ProductService);
  readonly destroyRef = inject(DestroyRef);
  readonly document = inject(DOCUMENT);
  readonly router = inject(Router);
  readonly qrcodeService = inject(NgxScannerQrcodeService);

  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  public products: Product[] = [];
  public selectedProducts: Product[] = [];

  public config: ScannerQRCodeConfig = {
    constraints: {
      video: {
        width: window.innerWidth,
      },
    },
    canvasStyles: [
      {
        /* layer */ lineWidth: 1,
        fillStyle: '#00950685',
        strokeStyle: '#00950685',
      },
      {
        /* text */ font: '17px serif',
        fillStyle: '#ff0000',
        strokeStyle: '#ff0000',
      },
    ],
  };

  private isFullscreen = false;

  ngOnInit(): void {
    this.fetchProducts();
  }

  ngAfterViewInit(): void {
    this.action.isReady.subscribe((res: any) => {
      // this.handle(this.action, 'start');
    });
  }

  public onEvent(e: ScannerQRCodeResult[], action?: any): void {
    // e && action && action.pause();
    console.log(e);
  }

  public handle(action: any, fn: string): void {
    const playDeviceFacingBack = (devices: any[]) => {
      // front camera or back camera check here!
      const device = devices.find((f) =>
        /back|rear|environment/gi.test(f.label)
      ); // Default Back Facing Camera
      action.playDevice(device ? device.deviceId : devices[0].deviceId);
    };

    if (fn === 'start') {
      action[fn](playDeviceFacingBack).subscribe(
        (r: any) => console.log(fn, r),
        alert
      );
    } else {
      action[fn]().subscribe((r: any) => console.log(fn, r), alert);
    }
  }

  public handleAction(type: string) {
    switch (type) {
      case 'fullscreen':
        this.toggleFullScreen();
        break;
      case 'backtodashboard':
        this.backToDashboard();
        break;
      case 'vieworderlist':
        this.router.navigate(['/remotes-order/list']);
        break;
      case 'deleteallproduct':
        console.log(this.selectedProducts);

        this.selectedProducts = [];
        break;
      default:
        break;
    }
  }

  public removeProduct(product_uid: string) {
    const productIndex = this.selectedProducts.findIndex(
      (product) => product.product_uid === product_uid
    );
    if (productIndex !== -1) {
      this.selectedProducts.splice(productIndex, 1);
    }
  }

  private backToDashboard() {
    this.router.navigate(['/']);
  }

  private toggleFullScreen() {
    this.isFullscreen = !this.isFullscreen;
    if (this.isFullscreen) {
      openFullscreen(this.document.documentElement);
    } else {
      closeFullscreen(this.document);
    }
  }

  private fetchProducts(): void {
    this.productService
      .queryListProduct()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((data) => {
        this.products = data.response.content.map((product) => {
          return {
            ...product,
            product_quantity: 1,
            stock: product.product_quantity,
          };
        });
      });
  }
}
