import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AccountBalance, MonthlySummary, UploadResponse } from '../../shared/models/balance.model';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class BalanceService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiUrl}/Accounts`;


  getLatestBalances(): Observable<AccountBalance[]> {
    return this.http.get<AccountBalance[]>(`${this.apiUrl}/latest-balances`);
  }

  getBalancesByMonth(month: Date): Observable<AccountBalance[]> {
    const params = new HttpParams().set('month', month.toISOString());
    return this.http.get<AccountBalance[]>(`${this.apiUrl}/balances-by-month`, { params });
  }

  uploadFile(file: File): Observable<UploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    
    return this.http.post<UploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  getMonthlySummary(): Observable<MonthlySummary[]> {
    return this.http.get<MonthlySummary[]>(`${this.apiUrl}/monthly-summary`);
  }
}