import { Injectable, signal } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class LoadingService {
  private loading = signal(false);
  
  readonly isLoading = this.loading.asReadonly();

  setLoading(loading: boolean) {
    this.loading.set(loading);
  }
}