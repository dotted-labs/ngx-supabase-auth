import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import { AuthStore } from '../store/auth.store';

/**
 * Type for AuthGuard Route Data
 */
export interface AuthGuardData {
  /**
   * Custom redirect path when authentication is required
   */
  authRequiredRedirect?: string;
}

/**
 * Guard that prevents access to routes if the user is not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);

  console.log('[AuthGuard] Checking authentication for route: ' + state.url);

  // Get the custom redirect path from route data or use the default
  const routeData = route.data as AuthGuardData;
  const redirectPath = routeData?.authRequiredRedirect || config.authRequiredRedirect || '/login';

  return fromPromise(authStore.checkAuth()).pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        console.log('[AuthGuard] User is authenticated, access granted');
        return true;
      }

      // Redirect to login
      console.log('[AuthGuard] User is not authenticated, redirecting to ' + redirectPath);
      return router.parseUrl(redirectPath);
    }),
    catchError((error) => {
      console.error('[AuthGuard] Error checking authentication:', error);
      return of(router.parseUrl(redirectPath));
    }),
  );
};

/**
 * Route matcher guard that prevents access to routes if the user is not authenticated
 */
export const authMatch: CanMatchFn = (route, segments) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);

  const path = segments.map((segment) => segment.path).join('/');
  console.log('[AuthMatch] Checking authentication for path: ' + path);

  const redirectPath = config.authRequiredRedirect || '/login';

  return fromPromise(authStore.checkAuth()).pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        console.log('[AuthMatch] User is authenticated, access granted');
        return true;
      }

      // Redirect to login
      console.log('[AuthMatch] User is not authenticated, redirecting to ' + redirectPath);
      return router.parseUrl(redirectPath);
    }),
    catchError((error) => {
      console.error('[AuthMatch] Error checking authentication:', error);
      return of(router.parseUrl(redirectPath));
    }),
  );
};
