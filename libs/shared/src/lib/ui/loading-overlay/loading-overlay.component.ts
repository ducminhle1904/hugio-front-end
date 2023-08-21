import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'ims-loading-overlay',
  standalone: true,
  imports: [CommonModule, OverlayModule, PortalModule, ProgressSpinnerModule],
  template: `<div
    class="loading-overlay"
    [ngClass]="{ 'create-order-route': isCreateOrderRoute }"
  >
    <div class="backdrop"></div>
    <div class="spinner">
      <p-progressSpinner
        styleClass="w-4rem h-4rem"
        strokeWidth="8"
        fill="var(--surface-ground)"
        animationDuration=".5s"
      ></p-progressSpinner>
    </div>
  </div>`,
  styles: [
    `
      .loading-overlay {
        position: fixed;
        top: 5rem;
        left: 21.7rem;
        width: calc(100vw - 23.7rem);
        height: calc(100vh - 7rem);
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000; /* Adjust as needed */
      }

      .create-order-route {
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
      }

      .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5);
        border-radius: 7px;
      }

      .spinner {
        z-index: 1; /* Above the backdrop */
      }
    `,
  ],
})
export class LoadingOverlayComponent implements OnInit {
  isCreateOrderRoute = false;

  constructor(private router: Router) {}

  ngOnInit() {
    const currentRoute = this.router.url;
    if (currentRoute === '/remotes-order/create')
      this.isCreateOrderRoute = true;
  }
}
