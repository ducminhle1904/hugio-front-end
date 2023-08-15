import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { OverlayModule } from '@angular/cdk/overlay';
import { PortalModule } from '@angular/cdk/portal';
import { ProgressSpinnerModule } from 'primeng/progressspinner';

@Component({
  selector: 'ims-loading-overlay',
  standalone: true,
  imports: [CommonModule, OverlayModule, PortalModule, ProgressSpinnerModule],
  template: `<div class="loading-overlay">
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
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        display: flex;
        align-items: center;
        justify-content: center;
        z-index: 1000; /* Adjust as needed */
      }

      .backdrop {
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        background-color: rgba(0, 0, 0, 0.5); /* Semi-transparent backdrop */
      }

      .spinner {
        z-index: 1; /* Above the backdrop */
      }
    `,
  ],
})
export class LoadingOverlayComponent {}
