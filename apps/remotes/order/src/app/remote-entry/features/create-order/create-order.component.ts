import { CommonModule, DOCUMENT } from '@angular/common';
import {
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
import { OrderCreateRequest, Product, User } from '@ims/core';
import { OrderService, ProductService, UserService } from '@ims/data-access';
import {
  CalculateTotalPricePipe,
  LoadingOverlayService,
  closeFullscreen,
  openFullscreen,
} from '@ims/shared';
import {
  LOAD_WASM,
  NgxScannerQrcodeComponent,
  NgxScannerQrcodeModule,
  ScannerQRCodeResult,
} from 'ngx-scanner-qrcode';
import { MessageService } from 'primeng/api';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { CheckboxModule } from 'primeng/checkbox';
import { DividerModule } from 'primeng/divider';
import { DropdownModule } from 'primeng/dropdown';
import { InputNumberModule } from 'primeng/inputnumber';
import { MultiSelectModule } from 'primeng/multiselect';
import { TableModule } from 'primeng/table';
import { ToastModule } from 'primeng/toast';
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
    DropdownModule,
  ],
  template: `<p-toast></p-toast>
    <div class="flex gap-2 h-screen w-screen p-3">
      <div class="w-3/4">
        <p-card styleClass="h-full w-full">
          <div class="flex items-center justify-between">
            <div class="w-1/2">
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
                          product.price
                            | currency : 'VND' : 'symbol-narrow' : '1.0-0'
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
              (click)="action.isStart ? action.stop() : action.start()"
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
                          product.price
                            | currency : 'VND' : 'symbol-narrow' : '1.0-0'
                        }}<i
                          class="p-toolbar-separator pi pi-pencil ml-2"
                        ></i></div
                    ></ng-template>
                  </p-cellEditor>
                </td>
                <td class="font-bold">
                  {{
                    product.price * product.product_quantity
                      | currency : 'VND' : 'symbol-narrow' : '1.0-0'
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
          <ngx-scanner-qrcode
            #action="scanner"
            (event)="handleScanQr($event)"
          ></ngx-scanner-qrcode>

          <p-divider></p-divider>

          <div *ngIf="selectedProducts.length > 0">
            <div class="flex items-center gap-4">
              <div class="flex items-center gap-2">
                <p-checkbox [binary]="true" inputId="delivery"></p-checkbox>
                <label for="delivery">Delivery</label>
              </div>

              <div class="flex items-center gap-2">
                <p-checkbox
                  [binary]="true"
                  inputId="guest"
                  [(ngModel)]="isGuest"
                ></p-checkbox>
                <label for="guest">Guest</label>
              </div>
            </div>

            <p-divider></p-divider>

            <p-dropdown
              [options]="clients"
              [(ngModel)]="selectedClient"
              optionLabel="username"
              styleClass="w-full"
              placeholder="Select a Client"
              *ngIf="!isGuest"
            ></p-dropdown>

            <p-divider></p-divider>

            <div class="flex items-center justify-between">
              <p class="text-2xl">
                Total: ({{ selectedProducts.length }} product)
              </p>
              <p class="text-2xl">
                {{
                  selectedProducts
                    | calculateTotalPrice
                    | currency : 'VND' : 'symbol-narrow' : '1.0-0'
                }}
              </p>
            </div>

            <div class="flex items-center justify-between">
              <p class="text-2xl">VAT (10%)</p>
              <p class="text-2xl">
                {{
                  (selectedProducts | calculateTotalPrice) * 0.1
                    | currency : 'VND' : 'symbol-narrow' : '1.0-0'
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
                (click)="createOrder()"
                [disabled]="selectedProducts.length === 0"
              ></p-button>
            </div>
          </ng-template>
        </p-card>
      </div>
    </div> `,
  styles: [
    `
      :host ::ng-deep .p-card .p-card-body {
        height: 100%;
      }
      :host ::ng-deep .p-card .p-card-content {
        height: 90%;
        padding: unset;
      }
      :host ::ng-deep .p-datatable {
        height: 90%;
      }
    `,
  ],
  providers: [MessageService],
  encapsulation: ViewEncapsulation.Emulated,
})
export class CreateOrderComponent implements OnInit {
  readonly productService = inject(ProductService);
  readonly userService = inject(UserService);
  readonly orderService = inject(OrderService);
  readonly destroyRef = inject(DestroyRef);
  readonly document = inject(DOCUMENT);
  readonly router = inject(Router);
  readonly messageService = inject(MessageService);
  readonly loadingOverlayService = inject(LoadingOverlayService);

  @ViewChild('action') action!: NgxScannerQrcodeComponent;

  public products: Product[] = [];
  public selectedProducts: Product[] = [];

  public clients: User[] = [];
  public selectedClient: User | undefined = undefined;

  public isGuest = false;

  private isFullscreen = false;

  ngOnInit(): void {
    LOAD_WASM().subscribe((res: unknown) => console.log('LOAD_WASM', res));
    this.fetchProducts();
    this.fetchClients();
  }

  public async handleScanQr(result: ScannerQRCodeResult[]) {
    const [firstResult] = result;
    if (firstResult.value) {
      this.action.pause();
      const productMap = new Map(
        this.products.map((product) => [product.product_uid, product])
      );
      const scannedProduct = productMap.get(firstResult.value);
      if (scannedProduct) {
        const selectedProductMap = new Map(
          this.selectedProducts.map((product) => [product.product_uid, product])
        );
        const selectedProduct = selectedProductMap.get(
          scannedProduct.product_uid
        );
        if (selectedProduct) {
          selectedProduct.product_quantity =
            (selectedProduct.product_quantity || 0) + 1;
        } else {
          this.selectedProducts.push(scannedProduct);
        }
      }
      await new Promise((resolve) => setTimeout(resolve, 2000));
      this.action.play();
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
    this.selectedProducts = this.selectedProducts.filter(
      (product) => product.product_uid !== product_uid
    );
  }

  public createOrder() {
    this.loadingOverlayService.show();
    const request = this.buildOrderRequest();
    this.placeOrder(request);
  }

  private buildOrderRequest(): OrderCreateRequest {
    const order_information = this.selectedProducts.map((product) => ({
      product_uid: product.product_uid,
      quantity: product.product_quantity,
    }));

    return {
      request: {
        customer_name: this.selectedClient?.username ?? null,
        customer_phone_number: this.selectedClient?.phone_number ?? null,
        order_information,
      },
    };
  }

  private placeOrder(request: OrderCreateRequest): void {
    this.orderService
      .placeAnOrder(request)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: () => this.handleOrderSuccess(),
        error: () => this.handleOrderError(),
      });
  }

  private handleOrderSuccess(): void {
    this.loadingOverlayService.hide();
    this.messageService.add({
      severity: 'success',
      summary: 'Success',
      detail: 'Order successfully',
    });
    this.action.stop();
    this.router.navigate(['/remotes-order/list']);
  }

  private handleOrderError(): void {
    this.loadingOverlayService.hide();
    this.messageService.add({
      severity: 'error',
      summary: 'Failed',
      detail: 'Fail to place an order, please try again!',
    });
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

  private fetchClients(): void {
    this.userService
      .queryListUser()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.clients = data.response.content;
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There is an error when getting clients',
          });
        },
      });
  }

  private fetchProducts(): void {
    this.productService
      .queryListProduct()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (data) => {
          this.products = data.response.content.map((product) => {
            return {
              ...product,
              product_quantity: 1,
              stock: product.product_quantity,
            };
          });
        },
        error: () => {
          this.messageService.add({
            severity: 'error',
            summary: 'Error',
            detail: 'There is an error when getting products',
          });
        },
      });
  }
}
