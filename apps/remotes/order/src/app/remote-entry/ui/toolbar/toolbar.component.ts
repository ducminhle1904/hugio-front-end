import {
  ChangeDetectionStrategy,
  Component,
  Output,
  EventEmitter,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ToolbarModule } from 'primeng/toolbar';
import { TooltipModule } from 'primeng/tooltip';
import { ButtonModule } from 'primeng/button';

@Component({
  selector: 'ims-toolbar',
  standalone: true,
  imports: [CommonModule, ToolbarModule, TooltipModule, ButtonModule],
  template: `<p-toolbar>
    <div class="p-toolbar-group-start gap-2">
      <p-button
        label="View list orders"
        icon="pi pi-eye"
        styleClass="p-button-info"
        (click)="outputAction('vieworderlist')"
      ></p-button>
      <p-button
        label="Delete all product"
        icon="pi pi-trash"
        styleClass="p-button-danger"
        (click)="outputAction('deleteallproduct')"
      ></p-button>
    </div>
    <div class="p-toolbar-group-end">
      <p-button
        icon="pi pi-user"
        styleClass="p-button-success mr-2"
        pTooltip="Client profile"
        tooltipPosition="top"
      ></p-button>
      <p-button
        icon="pi pi-arrows-alt"
        styleClass="p-button-success mr-2"
        pTooltip="Fullscreen mode"
        tooltipPosition="top"
        (click)="outputAction('fullscreen')"
      ></p-button>
      <p-button
        icon="pi pi-home"
        styleClass="p-button-success mr-2"
        pTooltip="Back to dashboard"
        tooltipPosition="top"
        (click)="outputAction('backtodashboard')"
      ></p-button>
    </div>
  </p-toolbar>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  @Output() action = new EventEmitter<string>();

  public outputAction(type: string) {
    this.action.emit(type);
  }
}
