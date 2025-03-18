import { Component, inject, input, output, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthProvider, SocialAuthProvider } from '../../models/auth.models';
import { AuthStore } from '../../store/auth.store';
import { SUPABASE_AUTH_CONFIG } from '../../config/supabase-auth.config';
import { SocialLoginComponent } from '../social-login/social-login.component';

/**
 * Login component to handle email/password and social login
 */
@Component({
  selector: 'sup-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SocialLoginComponent],
  templateUrl: './login.component.html',
})
export class LoginComponent implements OnInit {
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
   * Providers habilitados desde la configuración
   */
  public enabledProviders: AuthProvider[] = [];

  /**
   * Flag to show email/password form
   */
  public showEmailPasswordForm = false;

  /**
   * Event emitted when user clicks forgot password
   */
  public forgotPassword = output<void>();

  /**
   * Event emitted when user clicks signup
   */
  public signup = output<void>();

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
   * Helper to check if a provider is enabled
   * @param provider Auth provider
   * @returns True if the provider is enabled, false otherwise
   */
  public isProviderEnabled(provider: AuthProvider): boolean {
    return this.enabledProviders.includes(provider);
  }

  public onGoToSignup(): void {
    this.signup.emit();
  }
}
