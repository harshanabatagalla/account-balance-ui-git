import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const adminGuard: CanActivateFn = (route, state) => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  const account = msalService.instance.getActiveAccount();
  
  if (account) {
    // check roles from Azure AD token claims
    const roles = account.idTokenClaims?.['roles'] || [];
    if (roles.includes('Admin') || roles.includes('admin')) {
      return true;
    }
  }
  
  router.navigate(['/unauthorized']);
  return false;
};