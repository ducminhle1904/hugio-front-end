import { Route } from '@angular/router';
import { AuthGuard, UserService } from '@ims/core';
import { loadRemoteModule } from '@nx/angular/mf';
import { inject } from '@angular/core';
import { map } from 'rxjs';
import { LayoutComponent } from '@ims/shared';

export const appRoutes: Route[] = [
  {
    path: '',
    redirectTo: 'remotes-summary',
    pathMatch: 'full',
  },
  {
    path: 'remotes-auth',
    loadChildren: () =>
      loadRemoteModule('remotes-auth', './Module').then(
        (m) => m.RemoteEntryModule
      ),
    canActivate: [
      () => inject(UserService).isAuthenticated.pipe(map((isAuth) => !isAuth)),
    ],
  },
  {
    path: 'remotes-order',
    loadChildren: () =>
      loadRemoteModule('remotes-order', './Module').then(
        (m) => m.RemoteEntryModule
      ),
    canActivate: [AuthGuard],
  },
  {
    path: '',
    component: LayoutComponent,
    children: [
      {
        path: 'remotes-product',
        loadChildren: () =>
          loadRemoteModule('remotes-product', './Module').then(
            (m) => m.RemoteEntryModule
          ),
        data: {
          title: 'Product',
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'remotes-user',
        loadChildren: () =>
          loadRemoteModule('remotes-user', './Module').then(
            (m) => m.RemoteEntryModule
          ),
        data: {
          breadcrumb: 'User',
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'remotes-cashbook',
        loadChildren: () =>
          loadRemoteModule('remotes-cashbook', './Module').then(
            (m) => m.RemoteEntryModule
          ),
        data: {
          breadcrumb: 'Cashbook',
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'remotes-analysis',
        loadChildren: () =>
          loadRemoteModule('remotes-analysis', './Module').then(
            (m) => m.RemoteEntryModule
          ),
        data: {
          breadcrumb: 'Analysis',
        },
        canActivate: [AuthGuard],
      },
      {
        path: 'remotes-summary',
        loadChildren: () =>
          loadRemoteModule('remotes-summary', './Module').then(
            (m) => m.RemoteEntryModule
          ),
        data: {
          breadcrumb: 'Summary',
        },
        canActivate: [AuthGuard],
      },
    ],
  },
];
