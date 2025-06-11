import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { MsalService } from '@azure/msal-angular';

export const authGuard: CanActivateFn = (route, state) => {
  const msalService = inject(MsalService);
  const router = inject(Router);

  if (msalService.instance.getActiveAccount()) {
    return true;
  } else {
    router.navigate(['/login']);
    return false;
  }
};