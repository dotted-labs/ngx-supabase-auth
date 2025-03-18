import { HttpClient } from '@angular/common/http';
import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { catchError, map, of, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import { AuthStore } from '../store/auth.store';

/**
 * Type for FirstTimeProfileGuard Route Data
 */
export interface FirstTimeProfileGuardData {
  /**
   * Custom redirect path for completing the profile
   */
  firstTimeProfileRedirect?: string;
}

const createFirstTimeProfileGuard = (routeData?: FirstTimeProfileGuardData) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);
  const http = inject(HttpClient);

  const redirectPath = routeData?.firstTimeProfileRedirect || config.firstTimeProfileRedirect || '/complete-profile';

  // If no endpoint is configured, skip the check
  if (!config.firstTimeCheckEndpoint) {
    console.log('[FirstTimeProfileGuard] No endpoint configured, skipping check');
    return of(true);
  }

  return fromPromise(authStore.checkAuth()).pipe(
    switchMap((isAuthenticated) => {
      // If not authenticated, proceed normally (auth guard will handle this case)
      if (!isAuthenticated) {
        console.log('[FirstTimeProfileGuard] User not authenticated, skipping check');
        return of(true);
      }

      if (!authStore.user()) {
        console.log('[FirstTimeProfileGuard] No user found, skipping check');
        return of(true);
      }

      console.log(`[FirstTimeProfileGuard] Checking first-time status for user ${authStore.user()?.id}`);

      // Call the endpoint to check if it's the first time
      return http.get<boolean>(`${config.firstTimeCheckEndpoint}?userId=${authStore.user()?.id}`).pipe(
        map((isFirstTime) => {
          // If it's the first time, redirect to complete profile
          if (isFirstTime) {
            console.log(`[FirstTimeProfileGuard] First time detected, redirecting to ${redirectPath}`);
            return router.parseUrl(redirectPath);
          }

          console.log('[FirstTimeProfileGuard] Not first time, proceeding normally');
          return true;
        }),
        catchError((error) => {
          console.error('[FirstTimeProfileGuard] Error checking first time status:', error);
          // On error, treat as first time user and redirect
          console.log(`[FirstTimeProfileGuard] Error detected, treating as first time user, redirecting to ${redirectPath}`);
          return of(router.parseUrl(redirectPath));
        }),
      );
    }),
    catchError((error) => {
      console.error('[FirstTimeProfileGuard] Error in guard execution:', error);
      // In case of error, treat as first time user
      console.log(`[FirstTimeProfileGuard] Fatal error detected, treating as first time user, redirecting to ${redirectPath}`);
      return of(router.parseUrl(redirectPath));
    }),
  );
};

/**
 * Guard that checks if the user is accessing the system for the first time
 * and redirects to the profile completion page if needed
 */
export const firstTimeProfileGuard: CanActivateFn = (route, state) => {
  return createFirstTimeProfileGuard(route.data as FirstTimeProfileGuardData);
};

/**
 * Route matcher guard that checks if the user is accessing the system for the first time
 */
export const firstTimeProfileMatch: CanMatchFn = (route, segments) => {
  return createFirstTimeProfileGuard(route.data as FirstTimeProfileGuardData);
};
