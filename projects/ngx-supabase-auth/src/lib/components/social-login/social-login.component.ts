import { CommonModule } from '@angular/common';
import { Component, inject, signal } from '@angular/core';
import { SUPABASE_AUTH_CONFIG } from '../../config/supabase-auth.config';
import { AuthProvider, SocialAuthProvider } from '../../models/auth.models';
import { AuthStore } from '../../store/auth.store';

/**
 * Social login component to handle social authentication
 * This component can be used in both signin and signup flows
 */
@Component({
  selector: 'sup-social-login',
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
   * Login with a social provider
   * @param provider Social auth provider
   */
  public loginWithSocialProvider(provider: SocialAuthProvider): void {
    this.authStore.signInWithSocialProvider(provider);
  }
}
