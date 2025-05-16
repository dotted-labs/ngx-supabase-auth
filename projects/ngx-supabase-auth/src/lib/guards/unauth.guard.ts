import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { catchError, map, of, Observable } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import { AuthStore } from '../store/auth.store';
import { AuthGuardsUtilsService } from '../services/auth-guards-utils.service';

/**
 * Type for UnauthGuard Route Data
 */
export interface UnauthGuardData {
  /**
   * Custom redirect path when user should not be authenticated
   */
  redirectIfAuthenticated?: string;
}

const createUnauthGuard = (routeData?: UnauthGuardData): Observable<boolean | UrlTree> => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);
  const authGuardsUtilsService = inject(AuthGuardsUtilsService);

  // First, check for desktop redirect via queryParam
  const desktopRedirectUrlTree = authGuardsUtilsService.redirectToDesktopIfDesktopQueryParam();
  if (desktopRedirectUrlTree) {
    console.log('[UnauthGuard] Desktop query param detected, redirecting to desktop flow.');
    return of(desktopRedirectUrlTree);
  }

  const redirectPath = routeData?.redirectIfAuthenticated || config.redirectAfterLogin || '/';

  return fromPromise(authStore.checkAuth()).pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        console.log('[UnauthGuard] User is not authenticated, access granted');
        return true;
      }

      // User is authenticated, and no desktop redirect was triggered by query param
      console.log('[UnauthGuard] User is already authenticated, redirecting to ' + redirectPath);
      return router.parseUrl(redirectPath);
    }),
    catchError((error) => {
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
