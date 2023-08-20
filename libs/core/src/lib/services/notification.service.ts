import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export interface Notification {
  severity?: string;
  summary?: string;
  detail: string;
}

@Injectable({
  providedIn: 'root',
})
export class NotificationService {
  private defaultNotification: Notification = {
    severity: 'info',
    summary: 'Notification',
    detail: '',
  };

  private notificationSubject = new BehaviorSubject<Notification>(
    this.defaultNotification
  );

  public notification$ = this.notificationSubject.asObservable();

  constructor() {}

  showNotification(notification: Notification) {
    const mergedNotification: Notification = {
      ...this.defaultNotification,
      ...notification,
    };

    this.notificationSubject.next(mergedNotification);
  }
}
