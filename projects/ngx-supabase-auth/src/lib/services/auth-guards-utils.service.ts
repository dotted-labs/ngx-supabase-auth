import { Router, UrlTree } from '@angular/router';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import { SupabaseAuthConfig } from '../models/auth.models';

import { inject, Injectable } from '@angular/core';
import { AuthStore } from '../store/auth.store';
import { HttpClient } from '@angular/common/http';
import { catchError, map, Observable, of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardsUtilsService {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly config = inject(SUPABASE_AUTH_CONFIG);
  private readonly http = inject(HttpClient);

  /**
   * Redirect to desktop if desktop query param is true
   * @returns UrlTree for redirection or null
   */
  public redirectToDesktopIfDesktopQueryParam() {
    const queryParams = new URLSearchParams(window.location.search);
    console.log('[AuthGuardsUtilsService] Query params:', queryParams);
    const isDesktop = queryParams.get('desktop') === 'true';
    if (isDesktop) {
      console.log('[AuthGuardsUtilsService] Desktop redirect enabled');
      this.authStore.setRedirectToDesktopAfterLogin(true);
      return this.router.parseUrl(this.config.desktopAuthRedirect || '/');
    }
    return null;
  }

  /**
   * Redirect to desktop if desktop query param is true
   * @returns UrlTree for redirection or null
   */
  public redirectToDesktopIfDesktopLocalStorage() {
    const redirect = localStorage.getItem('redirectToDesktopAfterLogin');
    if (!!redirect) {
      console.log('[AuthGuardsUtilsService] Desktop redirect enabled');
      this.authStore.setRedirectToDesktopAfterLogin(false);
      return this.config.desktopAuthRedirect;
    }
    return null;
  }

  /**
   * Checks if a user is accessing the application for the first time
   * @param userId The user ID to check
   * @returns Observable that resolves to a boolean (true if first time) or an error
   */
  public checkIfFirstTimeUser(userId: string): Observable<boolean> {
    const firstTimeCheckEndpoint = this.config.firstTimeCheckEndpoint;
    const skipFirstTimeCheck = this.config.skipFirstTimeCheck;

    // Skip first time check if configured to do so or if endpoint is not available
    if (skipFirstTimeCheck || !firstTimeCheckEndpoint) {
      console.log('[AuthGuardsUtilsService] Skipping first time check');
      return of(false);
    }

    return this.http.get<boolean>(`${firstTimeCheckEndpoint}?userId=${userId}`).pipe(
      catchError((_error) => {
        console.error('[AuthGuardsUtilsService] Error checking first time status:', _error);
        // On error, default to false to be safe
        return of(false);
      }),
    );
  }

  /**
   * Handles the redirection based on authentication and first-time user status
   * @param isAuthenticated Whether the user is authenticated
   * @param isFirstTime Whether it's the user's first time
   * @param requestedUrl The URL that was requested
   * @returns UrlTree for redirection or boolean
   */
  public handleAuthRedirection(isAuthenticated: boolean, isFirstTime: boolean, requestedUrl?: string): boolean | UrlTree {
    const authRequiredRedirect = this.config.authRequiredRedirect || '/login';
    const completeProfilePath = this.config.firstTimeProfileRedirect || '/complete-profile';
    const afterLoginPath = this.config.redirectAfterLogin || '/dashboard';

    if (!isAuthenticated) {
      // Redirect to login if not authenticated
      console.log('[AuthGuardsUtilsService] User is not authenticated, redirecting to ' + authRequiredRedirect);
      return this.router.parseUrl(authRequiredRedirect);
    }

    if (isFirstTime) {
      // Si la URL solicitada es la misma que la ruta de perfil completo, permitir acceso directo
      // para evitar redirecciones infinitas
      if (requestedUrl && (requestedUrl === completeProfilePath || requestedUrl.startsWith(completeProfilePath))) {
        console.log(`[AuthGuardsUtilsService] Already at complete profile page, allowing access`);
        return true;
      }

      // First time user, redirect to complete profile
      console.log(`[AuthGuardsUtilsService] First time user detected, redirecting to ${completeProfilePath}`);
      return this.router.parseUrl(completeProfilePath);
    }

    // Returning user, redirect to after login path
    console.log(`[AuthGuardsUtilsService] Returning user, redirecting to ${afterLoginPath}`);
    return true;
  }
}
