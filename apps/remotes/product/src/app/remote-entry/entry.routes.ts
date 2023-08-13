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
          import('./features/product-list/product-list.component').then(
            (c) => c.ProductListComponent
          ),
      },
    ],
  },
];
