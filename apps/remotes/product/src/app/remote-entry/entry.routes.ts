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
          import('@ims/web/product/features').then(
            (c) => c.ProductListComponent
          ),
        data: {
          breadcrumb: 'Product List',
        },
      },
      // {
      //   path: 'create',
      //   loadComponent: () =>
      //     import('./features/product-detail/product-detail.component').then(
      //       (c) => c.ProductDetailComponent
      //     ),
      //     data: {
      //       breadcrumb: "Product Create",
      //     },
      // },
      // {
      //   path: 'detail/:id',
      //   loadComponent: () =>
      //     import('./features/product-detail/product-detail.component').then(
      //       (c) => c.ProductDetailComponent
      //     ),
      //     data: {
      //       breadcrumb: "Product Detail",
      //     },
      // },
    ],
  },
];
