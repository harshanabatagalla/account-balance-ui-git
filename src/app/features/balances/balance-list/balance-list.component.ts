import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { BalanceService } from '../../../core/services/balance.service';
import { ErrorHandlerService } from '../../../core/services/error-handler.service';
import { AccountBalance } from '../../../shared/models/balance.model';

@Component({
  selector: 'app-balance-list',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule
  ],
  templateUrl: './balance-list.component.html',
  styleUrl: './balance-list.component.scss'
})
export class BalanceListComponent implements OnInit {
  private readonly balanceService = inject(BalanceService);
  private readonly errorHandler = inject(ErrorHandlerService);

  balances = signal<AccountBalance[]>([]);
  loading = signal(false);

  ngOnInit() {
    this.loadLatestBalances();
  }

  loadLatestBalances() {
    this.loading.set(true);
    this.balanceService.getLatestBalances().subscribe({
      next: (data) => {
        this.balances.set(data);
        this.loading.set(false);
      },
      error: (error) => {
        this.errorHandler.handleError(error);
        this.loading.set(false);
      }
    });
  }

  getBalanceDate(): string {
    const balances = this.balances();
    if (balances.length > 0) {
      const date = new Date(balances[0].month);
      return `Balances as of ${date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'long' 
      })}`;
    }
    return 'Current Balances';
  }
}