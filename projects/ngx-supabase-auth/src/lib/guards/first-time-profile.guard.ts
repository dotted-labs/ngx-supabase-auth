import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router, UrlTree } from '@angular/router';
import { Observable, map, catchError, of, switchMap } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { HttpClient } from '@angular/common/http';
import { SupabaseAuthService } from '../services/auth.service';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';

/**
 * Type for FirstTimeProfileGuard Route Data
 */
export interface FirstTimeProfileGuardData {
  /**
   * Custom redirect path for completing the profile
   */
  firstTimeProfileRedirect?: string;
}

/**
 * Guard that checks if the user is accessing the system for the first time
 * and redirects to the profile completion page if needed
 */
export const firstTimeProfileGuard: CanActivateFn = (route, state) => {
  const authService = inject(SupabaseAuthService);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);
  const http = inject(HttpClient);

  // Log the guard execution
  console.log('🚧 [FirstTimeProfileGuard] Checking if user needs to complete profile');

  // Get the custom redirect path from route data or use the default
  const routeData = route.data as FirstTimeProfileGuardData;
  const redirectPath = routeData?.firstTimeProfileRedirect || config.firstTimeProfileRedirect || '/complete-profile';

  // If no endpoint is configured, skip the check
  if (!config.firstTimeCheckEndpoint) {
    console.log('⚠️ [FirstTimeProfileGuard] No endpoint configured, skipping check');
    return of(true);
  }

  return fromPromise(authService.isAuthenticated()).pipe(
    switchMap((isAuthenticated) => {
      // If not authenticated, proceed normally (auth guard will handle this case)
      if (!isAuthenticated) {
        console.log('🔒 [FirstTimeProfileGuard] User not authenticated, skipping check');
        return of(true);
      }

      return fromPromise(authService.getCurrentUser()).pipe(
        switchMap((user) => {
          if (!user) {
            console.log('👤 [FirstTimeProfileGuard] No user found, skipping check');
            return of(true);
          }

          console.log(`🔍 [FirstTimeProfileGuard] Checking first-time status for user ${user.id}`);

          // Call the endpoint to check if it's the first time
          return http.get<boolean>(`${config.firstTimeCheckEndpoint}?userId=${user.id}`).pipe(
            map((isFirstTime) => {
              // If it's the first time, redirect to complete profile
              if (isFirstTime) {
                console.log(`🔄 [FirstTimeProfileGuard] First time detected, redirecting to ${redirectPath}`);
                return router.parseUrl(redirectPath);
              }

              console.log('✅ [FirstTimeProfileGuard] Not first time, proceeding normally');
              return true;
            }),
            catchError((error) => {
              console.error('❌ [FirstTimeProfileGuard] Error checking first time status:', error);
              // On error, treat as first time user and redirect
              console.log(`🔄 [FirstTimeProfileGuard] Error detected, treating as first time user, redirecting to ${redirectPath}`);
              return of(router.parseUrl(redirectPath));
            }),
          );
        }),
      );
    }),
    catchError((error) => {
      console.error('❌ [FirstTimeProfileGuard] Error in guard execution:', error);
      // In case of error, treat as first time user
      console.log(`🔄 [FirstTimeProfileGuard] Fatal error detected, treating as first time user, redirecting to ${redirectPath}`);
      return of(router.parseUrl(redirectPath));
    }),
  );
};

/**
 * Route matcher guard that checks if the user is accessing the system for the first time
 */
export const firstTimeProfileMatch: CanMatchFn = (route, segments) => {
  const authService = inject(SupabaseAuthService);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);
  const http = inject(HttpClient);

  // Log the guard execution
  console.log('🚧 [FirstTimeProfileMatch] Checking if user needs to complete profile');

  const redirectPath = config.firstTimeProfileRedirect || '/complete-profile';

  // If no endpoint is configured, skip the check
  if (!config.firstTimeCheckEndpoint) {
    console.log('⚠️ [FirstTimeProfileMatch] No endpoint configured, skipping check');
    return of(true);
  }

  return fromPromise(authService.isAuthenticated()).pipe(
    switchMap((isAuthenticated) => {
      // If not authenticated, proceed normally (auth guard will handle this case)
      if (!isAuthenticated) {
        console.log('🔒 [FirstTimeProfileMatch] User not authenticated, skipping check');
        return of(true);
      }

      return fromPromise(authService.getCurrentUser()).pipe(
        switchMap((user) => {
          if (!user) {
            console.log('👤 [FirstTimeProfileMatch] No user found, skipping check');
            return of(true);
          }

          console.log(`🔍 [FirstTimeProfileMatch] Checking first-time status for user ${user.id}`);

          // Call the endpoint to check if it's the first time
          return http.get<boolean>(`${config.firstTimeCheckEndpoint}?userId=${user.id}`).pipe(
            map((isFirstTime) => {
              // If it's the first time, redirect to complete profile
              if (isFirstTime) {
                console.log(`🔄 [FirstTimeProfileMatch] First time detected, redirecting to ${redirectPath}`);
                return router.parseUrl(redirectPath);
              }

              console.log('✅ [FirstTimeProfileMatch] Not first time, proceeding normally');
              return true;
            }),
            catchError((error) => {
              console.error('❌ [FirstTimeProfileMatch] Error checking first time status:', error);
              // On error, treat as first time user and redirect
              console.log(`🔄 [FirstTimeProfileMatch] Error detected, treating as first time user, redirecting to ${redirectPath}`);
              return of(router.parseUrl(redirectPath));
            }),
          );
        }),
      );
    }),
    catchError((error) => {
      console.error('❌ [FirstTimeProfileMatch] Error in guard execution:', error);
      // In case of error, treat as first time user
      console.log(`🔄 [FirstTimeProfileMatch] Fatal error detected, treating as first time user, redirecting to ${redirectPath}`);
      return of(router.parseUrl(redirectPath));
    }),
  );
};
