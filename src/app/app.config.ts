import { ApplicationConfig, importProvidersFrom, APP_INITIALIZER } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { MatNativeDateModule } from '@angular/material/core';

import { routes } from './app.routes';
import { authInterceptor } from './core/interceptors/auth.interceptor';

// MSAL imports
import { 
  MsalModule, 
  MsalService, 
  MsalGuard, 
  MsalBroadcastService 
} from '@azure/msal-angular';
import { PublicClientApplication, InteractionType } from '@azure/msal-browser';
import { msalConfig } from './core/auth/masl-config';

// Factory function to create and initialize MSAL instance
export function MSALInstanceFactory(): PublicClientApplication {
  return new PublicClientApplication(msalConfig);
}

// Factory function for app initialization
export function initializeMsal(msalService: MsalService): () => Promise<void> {
  return async () => {
    try {
      await msalService.instance.initialize();
      console.log('MSAL initialized successfully');
      
      // Handle redirect promise
      await msalService.instance.handleRedirectPromise();
      
      // Set active account if available
      const accounts = msalService.instance.getAllAccounts();
      if (accounts.length > 0) {
        msalService.instance.setActiveAccount(accounts[0]);
        console.log('Active account set:', accounts[0].username);
      }
    } catch (error) {
      console.error('MSAL initialization failed:', error);
    }
  };
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    provideAnimationsAsync(),
    importProvidersFrom(
      MatNativeDateModule,
      MsalModule.forRoot(
        MSALInstanceFactory(), // Use factory function
        {
          // MsalGuardConfiguration
          interactionType: InteractionType.Popup,
          authRequest: {
            scopes: ['user.read']
          }
        },
        {
          // MsalInterceptorConfiguration
          interactionType: InteractionType.Popup,
          protectedResourceMap: new Map()
        }
      )
    ),
    MsalService,
    MsalGuard,
    MsalBroadcastService,
    {
      provide: APP_INITIALIZER,
      useFactory: initializeMsal,
      deps: [MsalService],
      multi: true
    }
  ]
};