import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class LoadingService {
  private isLoading$: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(
    false
  );

  constructor() {}

  // Set loading state
  setLoading(loading: boolean): void {
    this.isLoading$.next(loading);
  }

  // Get loading state as an observable
  isLoading(): Observable<boolean> {
    return this.isLoading$.asObservable();
  }
}
