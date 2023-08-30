import { Route } from '@angular/router';
import { RemoteEntryComponent } from './entry.component';

export const remoteRoutes: Route[] = [
  {
    path: '',
    component: RemoteEntryComponent,
    children: [
      {
        path: '',
        redirectTo: '/client',
        pathMatch: 'full',
      },
      {
        path: 'client',
        loadComponent: () =>
          import('./features/client-list/client-list.component').then(
            (c) => c.UserListComponent
          ),
      },
      {
        path: 'employee',
        loadComponent: () =>
          import('./features/employee-list/employee-list.component').then(
            (c) => c.EmployeeListComponent
          ),
      },
    ],
  },
];
