import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';

/**
 * Type for NotDesktopLoginGuard Route Data
 */
export interface NotDesktopLoginGuardData {
  /**
   * Custom redirect path when user is in desktop mode
   */
  desktopAuthRedirect?: string;
}

const createNotDesktopLoginGuard = (routeData?: NotDesktopLoginGuardData) => {
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);

  const redirectPath = routeData?.desktopAuthRedirect || config.desktopAuthRedirect || '/';

  return of(true).pipe(
    map(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const isDesktop = queryParams.get('desktop') === 'true';

      if (isDesktop) {
        console.log('[NotDesktopLoginGuard] Desktop mode detected, redirecting to ' + redirectPath);
        return router.parseUrl(redirectPath);
      }

      console.log('[NotDesktopLoginGuard] Not in desktop mode, access granted');
      return true;
    }),
    catchError((error) => {
      // In case of error, allow access
      console.error('[NotDesktopLoginGuard] Error checking desktop parameter:', error);
      console.log('[NotDesktopLoginGuard] Allowing access due to error');
      return of(true);
    }),
  );
};

/**
 * Guard that checks if the user is NOT in desktop mode and allows access,
 * otherwise redirects them to the appropriate page.
 * Useful for differentiating between web and desktop login flows.
 */
export const isNotDesktopLoginGuard: CanActivateFn = (route, state) => {
  return createNotDesktopLoginGuard(route.data as NotDesktopLoginGuardData);
};

/**
 * Route matcher guard that checks if the user is NOT in desktop mode
 */
export const isNotDesktopLoginMatch: CanMatchFn = (route, segments) => {
  return createNotDesktopLoginGuard(route.data as NotDesktopLoginGuardData);
};
