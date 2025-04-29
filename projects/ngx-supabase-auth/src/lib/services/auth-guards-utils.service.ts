import { Router } from '@angular/router';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import { SupabaseAuthConfig } from '../models/auth.models';

import { inject, Injectable } from '@angular/core';
import { AuthStore } from '../store/auth.store';

@Injectable({
  providedIn: 'root',
})
export class AuthGuardsUtilsService {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly config = inject(SUPABASE_AUTH_CONFIG);

  public redirectToDesktopIfDesktopQueryParam() {
    const queryParams = new URLSearchParams(window.location.search);
    console.log('[UnauthGuard] Query params:', queryParams);
    if (queryParams.get('desktop') === 'true') {
      console.log('[UnauthGuard] Desktop redirect enabled');
      this.authStore.setRedirectToDesktopAfterLogin(true);
      return this.router.parseUrl(this.config.desktopAuthRedirect || '/');
    }
    return null;
  }

  public checkDesktopRedirect(): void {
    const redirect = this.authStore.redirectToDesktopAfterLogin();
    console.log('[AuthGuardsUtilsService] Desktop redirect enabled', redirect);
  }
}
