import { Routes } from '@angular/router';
import { authGuard } from './core/guards/auth.guard';
import { adminGuard } from './core/guards/admin.guard';

export const routes: Routes = [
  {
    path: 'login',
    loadComponent: () => import('./features/auth/login/login.component').then(m => m.LoginComponent)
  },
  {
    path: 'unauthorized',
    loadComponent: () => import('./features/auth/unauthorized/unauthorized.component').then(m => m.UnauthorizedComponent)
  },
  {
    path: '',
    loadComponent: () => import('./shared/components/layout/layout.component').then(m => m.LayoutComponent),
    canActivate: [authGuard],
    children: [
      {
        path: '',
        redirectTo: '/balances',
        pathMatch: 'full'
      },
      {
        path: 'balances',
        loadComponent: () => import('./features/balances/balance-list/balance-list.component').then(m => m.BalanceListComponent)
      },
      {
        path: 'manage-accounts',
        loadComponent: () => import('./features/manage-accounts/manage-accounts.component').then(m => m.ManageAccountsComponent),
        canActivate: [adminGuard]
      }
    ]
  },
  {
    path: '**',
    redirectTo: '/balances'
  }
];