import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';

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
        path: 'list',
        loadComponent: () =>
          import('./features/product-table/product-table.component').then(
            (c) => c.ProductTableComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('./features/product-detail/product-detail.component').then(
            (c) => c.ProductDetailComponent
          ),
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('./features/product-detail/product-detail.component').then(
            (c) => c.ProductDetailComponent
          ),
      },
    ],
  },
];
