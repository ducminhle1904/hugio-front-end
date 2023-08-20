import { Component, OnInit, inject } from '@angular/core';
import { Notification, NotificationService } from '@ims/core';
import { MessageService, PrimeNGConfig } from 'primeng/api';

@Component({
  selector: 'ims-root',
  template: `<p-toast></p-toast><router-outlet></router-outlet>`,
})
export class AppComponent implements OnInit {
  isCollapsed = false;
  readonly primengConfig = inject(PrimeNGConfig);
  messageService = inject(MessageService);
  notificationService = inject(NotificationService);

  ngOnInit() {
    this.primengConfig.ripple = true;
    this.notificationService.notification$.subscribe((notification) => {
      this.showMessage(notification);
    });
  }

  private showMessage(notification: Notification) {
    this.messageService.add({
      severity: notification.severity || 'info',
      summary: notification.summary || 'Notification',
      detail: notification.detail,
    });
  }
}
