import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { remoteRoutes } from './entry.routes';

import { DynamicDialogRef } from 'primeng/dynamicdialog';

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [CommonModule, RouterModule.forChild(remoteRoutes)],
  providers: [DynamicDialogRef],
})
export class RemoteEntryModule {}
