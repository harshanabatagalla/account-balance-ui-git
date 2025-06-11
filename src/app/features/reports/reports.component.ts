import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardContent } from '@angular/material/card';
import { MatCard } from '@angular/material/card';
import { MonthlySummary } from '../../shared/models/balance.model';
import { BalanceService } from '../../core/services/balance.service';
import { ErrorHandlerService } from '../../core/services/error-handler.service';
@Component({
  selector: 'app-reports',
  standalone: true,
  imports: [
    CommonModule,
    MatCardContent,
    MatCard
  ],
  templateUrl: './reports.component.html',
  styleUrl: './reports.component.scss'
})
export class ReportsComponent implements OnInit {
  private readonly balanceService = inject(BalanceService);
  private readonly errorHandler = inject(ErrorHandlerService);
  
  summaries = signal<MonthlySummary[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.balanceService.getMonthlySummary().subscribe((summaries) => {
      this.summaries.set(summaries);
    });
  }

  loadingSummaries() {
    this.loading.set(true);
    this.balanceService.getMonthlySummary().subscribe({
      next: (data) => {
        this.summaries.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        console.error('Error loading summaries:', error);
        this.errorHandler.handleError(error);
        this.loading.set(false);
      }
    });
  }

  formatMonth(dateStr: string): string {
    const date = new Date(dateStr);
    return date.toLocaleString('default', { month: 'long', year: 'numeric' });
  }
}