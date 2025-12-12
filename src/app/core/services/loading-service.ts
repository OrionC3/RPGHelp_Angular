import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private isLoadingSubject = new BehaviorSubject<boolean>(false);
  public isLoading$: Observable<boolean> = this.isLoadingSubject.asObservable();

  constructor() { }

  /** Affiche le spinner. */
  show(): void {
    this.isLoadingSubject.next(true);
  }

  /** Masque le spinner. */
  hide(): void {
    this.isLoadingSubject.next(false);
  }

  /** Affiche le spinner pendant X millisecondes. */
  showFor(ms: number = 2000): void {
    this.show();
    setTimeout(() => this.hide(), ms);
  }
}
