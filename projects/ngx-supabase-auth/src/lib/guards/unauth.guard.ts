import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import { AuthStore } from '../store/auth.store';

/**
 * Type for UnauthGuard Route Data
 */
export interface UnauthGuardData {
  /**
   * Custom redirect path when user should not be authenticated
   */
  authRedirectIfAuthenticated?: string;
}

const createUnauthGuard = (routeData?: UnauthGuardData) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);

  const redirectPath = routeData?.authRedirectIfAuthenticated || config.authRedirectIfAuthenticated || '/';

  return fromPromise(authStore.checkAuth()).pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        console.log('[UnauthGuard] User is not authenticated, access granted');
        return true;
      }

      // Redirect to home or dashboard
      console.log('[UnauthGuard] User is already authenticated, redirecting to ' + redirectPath);
      return router.parseUrl(redirectPath);
    }),
    catchError((error) => {
      // In case of error, allow access
      console.error('[UnauthGuard] Error checking authentication:', error);
      console.log('[UnauthGuard] Allowing access due to error');
      return of(true);
    }),
  );
};

/**
 * Guard that prevents access to routes if the user is already authenticated
 * Useful for login, register, and password reset pages
 */
export const unauthGuard: CanActivateFn = (route, state) => {
  return createUnauthGuard(route.data as UnauthGuardData);
};

/**
 * Route matcher guard that prevents access to routes if the user is already authenticated
 */
export const unauthMatch: CanMatchFn = (route, segments) => {
  return createUnauthGuard(route.data as UnauthGuardData);
};
