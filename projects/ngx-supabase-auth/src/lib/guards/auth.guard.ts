import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { switchMap } from 'rxjs/operators';
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

const createAuthGuard = (routeData?: AuthGuardData, url?: string): Observable<boolean | UrlTree> => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);
  const authGuardsUtilsService = inject(AuthGuardsUtilsService);

  const redirectPath = routeData?.authRequiredRedirect || config.authRequiredRedirect || '/login';

  return fromPromise(authStore.checkAuth()).pipe(
    switchMap(({ isAuthenticated, user }) => {
      // Check if we should redirect to desktop-login-redirect after login

      const redirectToDesktop = authGuardsUtilsService.redirectToDesktopIfDesktopLocalStorage();
      if (redirectToDesktop) {
        return of(router.parseUrl(redirectToDesktop));
      }

      const userId = user?.id;

      if (!isAuthenticated || !userId) {
        // Redirect to login if not authenticated
        console.log('[AuthGuard] User is not authenticated, redirecting to ' + redirectPath);
        return of(router.parseUrl(redirectPath));
      }

      // User is authenticated, check if it's first time
      console.log('[AuthGuard] User is authenticated, checking if first time');

      // Check if it's the user's first time
      return authGuardsUtilsService.checkIfFirstTimeUser(userId).pipe(
        map((isFirstTime) => {
          return authGuardsUtilsService.handleAuthRedirection(isAuthenticated, isFirstTime, url);
        }),
      );
    }),
    catchError((_error) => {
      console.error('[AuthGuard] Error checking authentication:', _error);
      return of(router.parseUrl(redirectPath));
    }),
  );
};

/**
 * Guard that prevents access to routes if the user is not authenticated
 * and handles redirection based on whether it's the user's first time
 */
export const authGuard: CanActivateFn = (route, state) => {
  return createAuthGuard(route.data as AuthGuardData, state.url);
};

/**
 * Route matcher guard that prevents access to routes if the user is not authenticated
 * and handles redirection based on whether it's the user's first time
 */
export const authMatch: CanMatchFn = (route, segments) => {
  const url = '/' + segments.map((segment) => segment.path).join('/');
  return createAuthGuard(route.data as AuthGuardData, url);
};
