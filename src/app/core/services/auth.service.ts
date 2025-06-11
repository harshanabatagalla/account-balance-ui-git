import { Injectable, inject, signal } from '@angular/core';
import { MsalService, MsalBroadcastService } from '@azure/msal-angular';
import { EventMessage, EventType, InteractionStatus } from '@azure/msal-browser';
import { filter, takeUntil, delay } from 'rxjs/operators';
import { Subject, timer } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';

export interface User {
  name: string;
  email: string;
  roles?: string[];
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly msalService = inject(MsalService);
  private readonly msalBroadcastService = inject(MsalBroadcastService);
  private readonly destroy$ = new Subject<void>();
    private readonly router = inject(Router);
    
  private user = signal<User | null>(null);
  private authenticated = signal(false);
  private isInitialized = false;
  
  readonly currentUser = this.user.asReadonly();
  readonly isAuthenticated = this.authenticated.asReadonly();


  constructor() {
    // Setup listeners immediately, but delay initial login display check
    this.setupMsalListeners();
    
    // Wait a bit for MSAL to be fully initialized via APP_INITIALIZER
    timer(100).subscribe(() => {
      this.setLoginDisplay();
    });
  }

  private setupMsalListeners() {
    this.msalBroadcastService.inProgress$
      .pipe(
        filter((status: InteractionStatus) => status === InteractionStatus.None),
        takeUntil(this.destroy$)
      )
      .subscribe(() => {
        this.setLoginDisplay();
      });

    this.msalBroadcastService.msalSubject$
      .pipe(
        filter((msg: EventMessage) => msg.eventType === EventType.LOGIN_SUCCESS),
        takeUntil(this.destroy$)
      )
      .subscribe((result: EventMessage) => {
        console.log('Login successful');
        this.setLoginDisplay();
      });
  }

  private setLoginDisplay() {
    try {
      // Check if MSAL is initialized by looking at internal state
      if (!this.msalService.instance.getConfiguration()) {
        console.log('MSAL not yet initialized, skipping login display check');
        return;
      }

      const account = this.msalService.instance.getActiveAccount();
      if (account) {
        this.authenticated.set(true);
        this.user.set({
          name: account.name || account.username,
          email: account.username,
          roles: this.extractRoles(account)
        });
        console.log('User authenticated:', account.username);
      } else {
        this.authenticated.set(false);
        this.user.set(null);
      }
    } catch (error) {
      if (error instanceof Error) {
        console.log('Error in setLoginDisplay (likely MSAL not initialized yet):', error.message);
      } else {
        console.log('Error in setLoginDisplay (likely MSAL not initialized yet):', error);
      }
      // Don't log full error stack as this is expected during initialization
    }
  }

  private extractRoles(account: any): string[] {
    // Extract roles from Azure AD token claims
    const roles = account.idTokenClaims?.['roles'] || [];
    const appRoles = account.idTokenClaims?.['app_roles'] || [];
    return [...roles, ...appRoles];
  }

 async login() {
  try {
    console.log('Attempting login...');
    const result = await this.msalService.loginPopup({
      scopes: environment.apiScopes
    }).toPromise();

    console.log('Login successful:', result);

    if (result?.account) {
      this.msalService.instance.setActiveAccount(result.account);
      this.setLoginDisplay();
      await this.router.navigate(['/balances']);
    }

  } catch (error) {
    console.error('Login failed:', error);
  }
}


  async logout() {
    try {
      await this.msalService.logoutPopup({
        mainWindowRedirectUri: "/"
      }).toPromise();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  }

  isAdmin(): boolean {
    const user = this.user();
    return user?.roles?.some(role => 
      role.toLowerCase().includes('admin')
    ) || false;
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}