import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { remoteRoutes } from './entry.routes';
import { NzButtonModule } from 'ng-zorro-antd/button';

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [CommonModule, RouterModule.forChild(remoteRoutes), NzButtonModule],
  providers: [],
})
export class RemoteEntryModule {}
