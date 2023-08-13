import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';
import { LayoutComponent } from '@ims/shared';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    children: [
      {
        path: '',
        redirectTo: '/list',
        pathMatch: 'full',
      },
      {
        path: '',
        component: LayoutComponent,
        children: [
          {
            path: 'list',
            loadComponent: () =>
              import('./features/order-list/order-list.component').then(
                (c) => c.OrderListComponent
              ),
          },
        ],
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/create-order/create-order.component').then(
            (c) => c.CreateOrderComponent
          ),
      },
    ],
  },
];
