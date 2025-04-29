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
export interface NotFirstTimeProfileGuardData {
  /**
   * Custom redirect path for completing the profile
   */
  notFirstTimeProfileRedirect?: string;
}

const createNotFirstTimeProfileGuard = (routeData?: NotFirstTimeProfileGuardData) => {
  const authStore = inject(AuthStore);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);
  const http = inject(HttpClient);

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
          // If it's not the first time, redirect to dashboard
          if (!isFirstTime) {
            console.log(`[FirstTimeProfileGuard] Not first time, redirecting to dashboard`);
            return router.parseUrl('/dashboard');
          }

          console.log('[FirstTimeProfileGuard] First time detected, proceeding normally');
          return true;
        }),
        catchError((error) => {
          console.error('[FirstTimeProfileGuard] Error checking first time status:', error);
          // On error, treat as not first time user and redirect to dashboard
          console.log(`[FirstTimeProfileGuard] Error detected, treating as not first time user, redirecting to dashboard`);
          return of(router.parseUrl('/dashboard'));
        }),
      );
    }),
    catchError((error) => {
      console.error('[FirstTimeProfileGuard] Error in guard execution:', error);
      // In case of error, treat as not first time user
      console.log(`[FirstTimeProfileGuard] Fatal error detected, treating as not first time user, redirecting to dashboard`);
      return of(router.parseUrl('/dashboard'));
    }),
  );
};

/**
 * Guard that checks if the user is accessing the system for the first time
 * and allows access only if it's their first time
 */
export const notFirstTimeProfileGuard: CanActivateFn = (route, state) => {
  return createNotFirstTimeProfileGuard(route.data as NotFirstTimeProfileGuardData);
};

/**
 * Route matcher guard that checks if the user is accessing the system for the first time
 * and allows access only if it's their first time
 */
export const notFirstTimeProfileMatch: CanMatchFn = (route, segments) => {
  return createNotFirstTimeProfileGuard(route.data as NotFirstTimeProfileGuardData);
};
