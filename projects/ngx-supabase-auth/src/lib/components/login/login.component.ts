import { Component, inject, input, output, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthProvider, SocialAuthProvider } from '../../models/auth.models';
import { AuthStore } from '../../store/auth.store';
import { SUPABASE_AUTH_CONFIG } from '../../config/supabase-auth.config';

/**
 * Login component to handle email/password and social login
 */
@Component({
  selector: 'sup-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
  /**
   * Whether to show social login options
   */
  public showSocialLogins = input(true);

  /**
   * Whether to show the forgot password link
   */
  public showForgotPassword = input(true);

  /**
   * Whether to show the sign up link
   */
  public showSignUpLink = input(true);

  /**
   * Event emitted when user clicks forgot password
   */
  public forgotPassword = output<void>();

  /**
   * Event emitted when user clicks sign up
   */
  public signUp = output<void>();

  /**
   * Login form group
   */
  public loginForm: FormGroup;

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
   * Auth provider enum
   */
  public AuthProvider = AuthProvider;

  /**
   * Providers habilitados desde la configuración
   */
  public enabledProviders: AuthProvider[] = [];

  /**
   * Flag to show email/password form
   */
  public showEmailPasswordForm = false;

  /**
   * Computed to check if there are social providers enabled
   */
  public hasSocialProviders = computed(() => {
    return this.enabledProviders.length > 0 && this.enabledProviders.some((p) => p !== AuthProvider.EMAIL_PASSWORD);
  });

  /**
   * Form builder
   */
  private fb = inject(FormBuilder);

  constructor() {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
    });
  }

  public ngOnInit(): void {
    // Obtener los providers habilitados de la configuración
    this.enabledProviders = this.config.enabledAuthProviders || [];

    // Verificar si el email/password está habilitado
    this.showEmailPasswordForm = this.enabledProviders.includes(AuthProvider.EMAIL_PASSWORD);
  }

  /**
   * Submit the login form
   */
  public onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authStore.signInWithEmail(email, password);
    }
  }

  /**
   * Login with a social provider
   * @param provider Social auth provider
   */
  public loginWithSocialProvider(provider: AuthProvider | SocialAuthProvider): void {
    this.authStore.signInWithSocialProvider(provider as SocialAuthProvider);
  }

  /**
   * Handle forgot password click
   */
  public onForgotPassword(): void {
    this.forgotPassword.emit();
  }

  /**
   * Handle sign up click
   */
  public onSignUp(): void {
    this.signUp.emit();
  }

  /**
   * Helper to check if a provider is enabled
   * @param provider Auth provider
   * @returns True if the provider is enabled, false otherwise
   */
  public isProviderEnabled(provider: AuthProvider): boolean {
    return this.enabledProviders.includes(provider);
  }
}
