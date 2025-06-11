import { HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { MsalService } from '@azure/msal-angular';
import { from, switchMap, catchError, of } from 'rxjs';
import { environment } from '../../../environments/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const msalService = inject(MsalService);

  // Only add auth header to API calls
  if (!req.url.startsWith(environment.apiUrl)) {
    return next(req);
  }

  try {
    const account = msalService.instance.getActiveAccount();
    if (!account) {
      return next(req);
    }

    // Get access token
    return from(
      msalService.instance.acquireTokenSilent({
        scopes: environment.apiScopes,
        account: account
      })
    ).pipe(
      switchMap(result => {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${result.accessToken}`
          }
        });
        return next(authReq);
      }),
      catchError(error => {
        console.error('Token acquisition failed:', error);
        return next(req);
      })
    );
  } catch (error) {
    if (error instanceof Error) {
      console.log('Auth interceptor error (likely MSAL not initialized):', error.message);
    } else {
      console.log('Auth interceptor error (likely MSAL not initialized):', error);
    }
    return next(req);
  }
};