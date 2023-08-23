import { CommonModule } from '@angular/common';
import {
  ChangeDetectionStrategy,
  Component,
  EventEmitter,
  Output,
} from '@angular/core';

import { MenuItem } from 'primeng/api';
import { AvatarModule } from 'primeng/avatar';
import { InputTextModule } from 'primeng/inputtext';
import { MenuModule } from 'primeng/menu';

@Component({
  selector: 'ims-user-bar',
  standalone: true,
  imports: [CommonModule, InputTextModule, AvatarModule, MenuModule],
  template: `<p-menu [model]="items" styleClass="w-full"></p-menu>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class UserBarComponent {
  @Output() target = new EventEmitter<string>();
  public items: MenuItem[] = [
    {
      label: 'System',
      items: [
        {
          label: 'Hugibot',
          icon: 'pi pi-android',
          command: () => {
            this.target.emit('hugibot');
          },
        },
      ],
    },
    {
      label: 'Clients',
      items: [
        {
          label: 'Client 1',
          icon: 'pi pi-user',
          command: () => {
            this.target.emit('client1');
          },
        },
        {
          label: 'Client 2',
          icon: 'pi pi-user',
          command: () => {
            this.target.emit('client2');
          },
        },
        {
          label: 'Client 3',
          icon: 'pi pi-user',
          command: () => {
            this.target.emit('client3');
          },
        },
        {
          label: 'Client 4',
          icon: 'pi pi-user',
          command: () => {
            this.target.emit('client4');
          },
        },
        {
          label: 'Client 5',
          icon: 'pi pi-user',
          command: () => {
            this.target.emit('client5');
          },
        },
      ],
    },
  ];
}
