import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { SUPABASE_AUTH_CONFIG } from '../../config/supabase-auth.config';
import { AuthProvider, SocialAuthProvider } from '../../models/auth.models';
import { AuthStore } from '../../store/auth.store';

/**
 * Social login component to handle social authentication
 * This component can be used in both signin and signup flows
 */
@Component({
  selector: 'sup-social-login',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './social-login.component.html',
})
export class SocialLoginComponent {
  /**
   * Auth store instance
   */
  public authStore = inject(AuthStore);

  /**
   * Config instance
   */
  public config = inject(SUPABASE_AUTH_CONFIG);

  /**
   * Social auth provider enum
   */
  public SocialAuthProvider = SocialAuthProvider;

  /**
   * Providers enabled from configuration
   */
  public enabledProviders: AuthProvider[] = [];

  constructor() {
    // Get enabled providers from configuration
    this.enabledProviders = this.config.enabledAuthProviders || [];
  }

  /**
   * Login with a social provider
   * @param provider Social auth provider
   */
  public loginWithSocialProvider(provider: SocialAuthProvider): void {
    this.authStore.signInWithSocialProvider(provider);
  }

  /**
   * Helper to check if a provider is enabled
   * @param provider Auth provider
   * @returns True if the provider is enabled, false otherwise
   */
  public isProviderEnabled(provider: SocialAuthProvider | AuthProvider): boolean {
    return this.enabledProviders.includes(provider as AuthProvider);
  }

  /**
   * Check if there are social providers enabled
   * @returns True if there are social providers enabled
   */
  public hasSocialProviders(): boolean {
    return this.enabledProviders.length > 0 && this.enabledProviders.some((p) => p !== AuthProvider.EMAIL_PASSWORD);
  }
}
