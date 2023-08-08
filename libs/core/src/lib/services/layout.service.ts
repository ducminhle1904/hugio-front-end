import { Injectable } from '@angular/core';
import { BehaviorSubject, distinctUntilChanged } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  private cardTitleSubject = new BehaviorSubject<string>('');
  public cardTitle = this.cardTitleSubject
    .asObservable()
    .pipe(distinctUntilChanged());

  constructor() {}

  public setCardTitle(newTitle: string): void {
    this.cardTitleSubject.next(newTitle);
  }
}
