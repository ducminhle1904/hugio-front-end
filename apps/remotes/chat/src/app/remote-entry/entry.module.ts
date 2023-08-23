import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { remoteRoutes } from './entry.routes';

import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { ChipModule } from 'primeng/chip';
import { AvatarModule } from 'primeng/avatar';
import { CardModule } from 'primeng/card';

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(remoteRoutes),
    ImageModule,
    ButtonModule,
    ChipModule,
    AvatarModule,
    CardModule,
  ],
  providers: [],
})
export class RemoteEntryModule {}
