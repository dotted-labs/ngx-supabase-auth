import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { SupabaseAuthService } from '../services/auth.service';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';

/**
 * Type for UnauthGuard Route Data
 */
export interface UnauthGuardData {
  /**
   * Custom redirect path when user should not be authenticated
   */
  authRedirectIfAuthenticated?: string;
}

/**
 * Guard that prevents access to routes if the user is already authenticated
 * Useful for login, register, and password reset pages
 */
export const unauthGuard: CanActivateFn = (route, state) => {
  const authService = inject(SupabaseAuthService);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);

  // Get the custom redirect path from route data or use the default
  const routeData = route.data as UnauthGuardData;
  const redirectPath =
    routeData?.authRedirectIfAuthenticated ||
    config.authRedirectIfAuthenticated ||
    '/';

  return fromPromise(authService.isAuthenticated()).pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        return true;
      }

      // Redirect to home or dashboard
      return router.parseUrl(redirectPath);
    }),
    catchError(() => {
      // In case of error, allow access
      return of(true);
    })
  );
};

/**
 * Route matcher guard that prevents access to routes if the user is already authenticated
 */
export const unauthMatch: CanMatchFn = (route, segments) => {
  const authService = inject(SupabaseAuthService);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);

  const redirectPath = config.authRedirectIfAuthenticated || '/';

  return fromPromise(authService.isAuthenticated()).pipe(
    map((isAuthenticated) => {
      if (!isAuthenticated) {
        return true;
      }

      // Redirect to home or dashboard
      return router.parseUrl(redirectPath);
    }),
    catchError(() => {
      // In case of error, allow access
      return of(true);
    })
  );
};
