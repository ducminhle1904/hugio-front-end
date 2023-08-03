import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BreadcrumbModule } from 'primeng/breadcrumb';
import { MenuItem } from 'primeng/api';
import { filter } from 'rxjs';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { isNullOrUndefined } from '../../utils/utils';

@Component({
  selector: 'ims-breadcrumb',
  standalone: true,
  imports: [CommonModule, BreadcrumbModule],
  template: `<p-breadcrumb
    class="max-w-full"
    [model]="menuItems"
    [home]="home"
  ></p-breadcrumb>`,
  styles: [],
})
export class BreadcrumbComponent implements OnInit {
  readonly router = inject(Router);
  readonly activatedRoute = inject(ActivatedRoute);

  readonly home: MenuItem = { icon: 'pi pi-home', url: 'home' };
  static ROUTE_DATA_BREADCRUMB = 'breadcrumb';
  menuItems: MenuItem[] | undefined;

  ngOnInit() {
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe(
        () =>
          (this.menuItems = this.createBreadcrumbs(this.activatedRoute.root))
      );
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url = '#',
    breadcrumbs: MenuItem[] = []
  ): MenuItem[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map((segment) => segment.path)
        .join('/');
      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      const label =
        child.snapshot.data[BreadcrumbComponent.ROUTE_DATA_BREADCRUMB];
      if (!isNullOrUndefined(label)) {
        breadcrumbs.push({ label, url });
      }
    }

    // Move the recursive call outside the loop to process all children
    for (const child of children) {
      breadcrumbs = this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }
}
