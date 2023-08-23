import { ChangeDetectionStrategy, Component } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'ims-chat-toolbar',
  standalone: true,
  imports: [CommonModule],
  template: `<p>chat-toolbar works!</p>`,
  styles: [],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ChatToolbarComponent {}
