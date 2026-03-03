import { Component, computed, DestroyRef, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { SUPABASE_AUTH_CONFIG } from '../../config/supabase-auth.config';
import { AuthStore } from '../../store/auth.store';

const AUTH_TIMEOUT_MS = 10_000;

/**
 * Handles the OAuth callback redirect from social providers (Google, Facebook, etc.).
 * This component must be placed on an UNGUARDED route so the Supabase client
 * can process the hash tokens before any auth guard runs.
 */
@Component({
  selector: 'sup-auth-callback',
  imports: [RouterLink],
  templateUrl: './auth-callback.component.html',
})
export class AuthCallbackComponent implements OnInit {
  public readonly authStore = inject(AuthStore);

  public readonly error = signal<string | null>(null);

  private readonly router = inject(Router);
  private readonly config = inject(SUPABASE_AUTH_CONFIG);
  private readonly destroyRef = inject(DestroyRef);

  public readonly loginPath = computed(() => this.config.authRequiredRedirect || '/login');

  public ngOnInit(): void {
    const oauthError = this.extractOAuthError();
    if (oauthError) {
      this.error.set(oauthError);
      return;
    }

    this.waitForAuthSession();
  }

  /**
   * Checks the current URL for OAuth error parameters returned by Supabase
   * when the provider flow fails (e.g. "Database error saving new user").
   */
  private extractOAuthError(): string | null {
    const params = new URLSearchParams(window.location.search);
    const hashParams = new URLSearchParams(window.location.hash.replace('#', '?'));

    const errorDescription =
      params.get('error_description') || hashParams.get('error_description');

    if (errorDescription) {
      return decodeURIComponent(errorDescription);
    }

    const errorParam = params.get('error') || hashParams.get('error');
    if (errorParam) {
      return decodeURIComponent(errorParam);
    }

    return null;
  }

  /**
   * Subscribes to onAuthStateChange and waits for a SIGNED_IN event.
   * Falls back to a polling check if the event was already fired before subscription.
   * Times out after AUTH_TIMEOUT_MS to avoid infinite loading.
   */
  private waitForAuthSession(): void {
    let resolved = false;

    const { data: { subscription } } = this.config.supabaseClient.auth.onAuthStateChange(
      async (event, session) => {
        if (resolved) return;

        if (session && (event === 'SIGNED_IN' || event === 'TOKEN_REFRESHED' || event === 'INITIAL_SESSION')) {
          resolved = true;
          subscription.unsubscribe();
          await this.handleAuthSuccess();
        }
      },
    );

    this.destroyRef.onDestroy(() => subscription.unsubscribe());

    setTimeout(async () => {
      if (resolved) return;

      const { data } = await this.config.supabaseClient.auth.getSession();
      if (data.session) {
        resolved = true;
        subscription.unsubscribe();
        await this.handleAuthSuccess();
        return;
      }

      resolved = true;
      subscription.unsubscribe();
      this.error.set('Authentication timed out. Please try again.');
    }, AUTH_TIMEOUT_MS);
  }

  private async handleAuthSuccess(): Promise<void> {
    const { isAuthenticated } = await this.authStore.checkAuth();

    if (!isAuthenticated) {
      this.error.set('Failed to establish session. Please try again.');
      return;
    }

    const redirectPath = this.config.redirectAfterLogin || '/';
    await this.router.navigateByUrl(redirectPath);
  }
}
