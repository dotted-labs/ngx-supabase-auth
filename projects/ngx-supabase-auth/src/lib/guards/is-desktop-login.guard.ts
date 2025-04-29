import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';

/**
 * Type for DesktopLoginGuard Route Data
 */
export interface DesktopLoginGuardData {
  /**
   * Custom redirect path when user is in desktop mode
   */
  desktopAuthRedirect?: string;
}

const createDesktopLoginGuard = (routeData?: DesktopLoginGuardData) => {
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);

  const redirectPath = routeData?.desktopAuthRedirect || config.desktopAuthRedirect || '/';

  return of(true).pipe(
    map(() => {
      const queryParams = new URLSearchParams(window.location.search);
      const isDesktop = queryParams.get('desktop') === 'true';

      if (isDesktop) {
        console.log('[DesktopLoginGuard] Desktop mode detected, redirecting to ' + redirectPath);
        return router.parseUrl(redirectPath);
      }

      console.log('[DesktopLoginGuard] Not in desktop mode, access granted');
      return true;
    }),
    catchError((error) => {
      // In case of error, allow access
      console.error('[DesktopLoginGuard] Error checking desktop parameter:', error);
      console.log('[DesktopLoginGuard] Allowing access due to error');
      return of(true);
    }),
  );
};

/**
 * Guard that checks if the user is in desktop mode and redirects them to the appropriate page
 * Useful for differentiating between web and desktop login flows
 */
export const isDesktopLoginGuard: CanActivateFn = (route, state) => {
  return createDesktopLoginGuard(route.data as DesktopLoginGuardData);
};

/**
 * Route matcher guard that checks if the user is in desktop mode
 */
export const isDesktopLoginMatch: CanMatchFn = (route, segments) => {
  return createDesktopLoginGuard(route.data as DesktopLoginGuardData);
};
