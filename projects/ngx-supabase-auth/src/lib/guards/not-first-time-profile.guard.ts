import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { catchError, map, Observable, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { switchMap } from 'rxjs/operators';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import { AuthStore } from '../store/auth.store';
import { AuthGuardsUtilsService } from '../services/auth-guards-utils.service';

/**
 * Type for NotFirstTimeProfileGuard Route Data
 */
export interface NotFirstTimeProfileGuardData {
  /**
   * Custom redirect path when user is accessing first time profile without needing it
   */
  notFirstTimeProfileRedirect?: string;
}

const createNotFirstTimeProfileGuard = (routeData?: NotFirstTimeProfileGuardData, url?: string): Observable<boolean | UrlTree> => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);
  const authGuardsUtilsService = inject(AuthGuardsUtilsService);

  const redirectPath = routeData?.notFirstTimeProfileRedirect || config.redirectAfterLogin || '/dashboard';
  const completeProfilePath = config.firstTimeProfileRedirect || '/complete-profile';

  // Si estamos ya en la ruta de complete-profile, permitir acceso para evitar redirecciones infinitas
  if (url && (url === completeProfilePath || url.startsWith(completeProfilePath))) {
    console.log(`[NotFirstTimeProfileGuard] Already at complete profile page, allowing access`);
    return of(true);
  }

  // If skipFirstTimeCheck is true, redirect to the main page
  if (config.skipFirstTimeCheck) {
    console.log('[NotFirstTimeProfileGuard] skipFirstTimeCheck is true, redirecting to dashboard');
    return of(router.parseUrl(redirectPath));
  }

  // If no endpoint is configured, skip the check
  if (!config.firstTimeCheckEndpoint) {
    console.log('[NotFirstTimeProfileGuard] No endpoint configured, redirecting to dashboard');
    return of(router.parseUrl(redirectPath));
  }

  return fromPromise(authStore.checkAuth()).pipe(
    switchMap((isAuthenticated) => {
      // If not authenticated, proceed normally (auth guard will handle this case)
      if (!isAuthenticated) {
        console.log('[NotFirstTimeProfileGuard] User not authenticated, redirecting to login');
        return of(router.parseUrl(config.authRequiredRedirect || '/login'));
      }

      if (!authStore.user()) {
        console.log('[NotFirstTimeProfileGuard] No user found, redirecting to dashboard');
        return of(router.parseUrl(redirectPath));
      }

      const userId = authStore.user()?.id as string;
      console.log(`[NotFirstTimeProfileGuard] Checking first-time status for user ${userId}`);

      // Call the endpoint to check if it's the first time
      return authGuardsUtilsService.checkIfFirstTimeUser(userId).pipe(
        map((isFirstTime) => {
          // If it's the first time, allow access
          if (isFirstTime) {
            console.log('[NotFirstTimeProfileGuard] First time detected, allowing access');
            return true;
          }

          // If it's not the first time, redirect to dashboard
          console.log(`[NotFirstTimeProfileGuard] Not first time, redirecting to ${redirectPath}`);
          return router.parseUrl(redirectPath);
        }),
        catchError((_error) => {
          console.error('[NotFirstTimeProfileGuard] Error checking first time status:', _error);
          // On error, allow access to be safe
          console.log('[NotFirstTimeProfileGuard] Error detected, allowing access to be safe');
          return of(true);
        }),
      );
    }),
    catchError((_error) => {
      console.error('[NotFirstTimeProfileGuard] Error in guard execution:', _error);
      // In case of error, allow access to be safe
      console.log('[NotFirstTimeProfileGuard] Fatal error detected, allowing access to be safe');
      return of(true);
    }),
  );
};

/**
 * Guard that checks if the user is accessing the system for the first time
 * and allows access only if it's their first time
 */
export const notFirstTimeProfileGuard: CanActivateFn = (route, state) => {
  return createNotFirstTimeProfileGuard(route.data as NotFirstTimeProfileGuardData, state.url);
};

/**
 * Route matcher guard that checks if the user is accessing the system for the first time
 * and allows access only if it's their first time
 */
export const notFirstTimeProfileMatch: CanMatchFn = (route, segments) => {
  const url = '/' + segments.map((segment) => segment.path).join('/');
  return createNotFirstTimeProfileGuard(route.data as NotFirstTimeProfileGuardData, url);
};
