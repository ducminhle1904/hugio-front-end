import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { RemoteEntryComponent } from './entry.component';
import { remoteRoutes } from './entry.routes';

import { ImageModule } from 'primeng/image';
import { ButtonModule } from 'primeng/button';
import { CardModule } from 'primeng/card';
import { UserBarComponent } from './ui/user-bar/user-bar.component';
import { HugibotToolbarComponent } from './ui/hugibot-toolbar/hugibot-toolbar.component';
import { ChatContentComponent } from './ui/chat-content/chat-content.component';

@NgModule({
  declarations: [RemoteEntryComponent],
  imports: [
    CommonModule,
    RouterModule.forChild(remoteRoutes),
    ImageModule,
    ButtonModule,
    CardModule,
    UserBarComponent,
    HugibotToolbarComponent,
    ChatContentComponent,
  ],
  providers: [],
})
export class RemoteEntryModule {}
