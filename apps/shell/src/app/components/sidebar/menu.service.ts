import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class MenuService {
  private menuSource = new Subject<any>();
  private resetSource = new Subject();

  menuSource$ = this.menuSource.asObservable();
  resetSource$ = this.resetSource.asObservable();

  onMenuStateChange(event: any) {
    this.menuSource.next(event);
  }

  reset() {
    this.resetSource.next(true);
  }
}
