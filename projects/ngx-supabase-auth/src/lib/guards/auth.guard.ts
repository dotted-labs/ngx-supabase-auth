import { inject } from '@angular/core';
import { CanActivateFn, CanMatchFn, Router } from '@angular/router';
import { map, catchError, of } from 'rxjs';
import { fromPromise } from 'rxjs/internal/observable/innerFrom';
import { SupabaseAuthService } from '../services/auth.service';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';

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
  const authService = inject(SupabaseAuthService);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);

  // Get the custom redirect path from route data or use the default
  const routeData = route.data as AuthGuardData;
  const redirectPath =
    routeData?.authRequiredRedirect || config.authRequiredRedirect || '/login';

  return fromPromise(authService.isAuthenticated()).pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      // Redirect to login
      return router.parseUrl(redirectPath);
    }),
    catchError(() => {
      return of(router.parseUrl(redirectPath));
    })
  );
};

/**
 * Route matcher guard that prevents access to routes if the user is not authenticated
 */
export const authMatch: CanMatchFn = (route, segments) => {
  const authService = inject(SupabaseAuthService);
  const router = inject(Router);
  const config = inject(SUPABASE_AUTH_CONFIG);

  const redirectPath = config.authRequiredRedirect || '/login';

  return fromPromise(authService.isAuthenticated()).pipe(
    map((isAuthenticated) => {
      if (isAuthenticated) {
        return true;
      }

      // Redirect to login
      return router.parseUrl(redirectPath);
    }),
    catchError(() => {
      return of(router.parseUrl(redirectPath));
    })
  );
};
