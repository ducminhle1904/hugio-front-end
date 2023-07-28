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
          import('./modules/product-list/product-list.component').then(
            (c) => c.ProductListComponent
          ),
      },
      {
        path: 'create',
        loadComponent: () =>
          import('@ims/web/product/feature').then(
            (c) => c.ProductDetailComponent
          ),
      },
      {
        path: 'detail/:id',
        loadComponent: () =>
          import('@ims/web/product/feature').then(
            (c) => c.ProductDetailComponent
          ),
      },
    ],
  },
];
