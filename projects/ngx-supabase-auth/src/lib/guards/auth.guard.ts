import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { catchError, map, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import { AuthStore } from '../store/auth.store';
import { AuthGuardsUtilsService } from '../services/auth-guards-utils.service';

/**
 * Type for AuthGuard Route Data
 */
export interface AuthGuardData {
  /**
   * Custom redirect path when authentication is required
   */
  authRequiredRedirect?: string;
}

const createAuthGuard = (routeData?: AuthGuardData) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);
  const authGuardsUtilsService = inject(AuthGuardsUtilsService);

  const redirectPath = routeData?.authRequiredRedirect || config.authRequiredRedirect || '/login';

  return fromPromise(authStore.checkAuth()).pipe(
    map((isAuthenticated) => {
      authGuardsUtilsService.checkDesktopRedirect();
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

/**
 * Guard that prevents access to routes if the user is not authenticated
 */
export const authGuard: CanActivateFn = (route, state) => {
  return createAuthGuard(route.data as AuthGuardData);
};

/**
 * Route matcher guard that prevents access to routes if the user is not authenticated
 */
export const authMatch: CanMatchFn = (route, segments) => {
  return createAuthGuard(route.data as AuthGuardData);
};
