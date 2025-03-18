import { Component, inject, input, output, OnInit, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthProvider, SocialAuthProvider } from '../../models/auth.models';
import { AuthStore } from '../../store/auth.store';
import { SUPABASE_AUTH_CONFIG } from '../../config/supabase-auth.config';
import { SocialLoginComponent } from '../social-login/social-login.component';

/**
 * Signup component to handle email/password registration and social signup
 */
@Component({
  selector: 'sup-signup',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, SocialLoginComponent],
  templateUrl: './signup.component.html',
})
export class SignupComponent implements OnInit {
  /**
   * Event emitted when user clicks login
   */
  public login = output<void>();

  /**
   * Signup form group
   */
  public signupForm: FormGroup;

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
   * Providers enabled from configuration
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

  public backToLogin = output<void>();
  constructor() {
    this.signupForm = this.fb.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validator: this.passwordMatchValidator },
    );
  }

  public ngOnInit(): void {
    // Get enabled providers from configuration
    this.enabledProviders = this.config.enabledAuthProviders || [];

    // Check if email/password is enabled
    this.showEmailPasswordForm = this.enabledProviders.includes(AuthProvider.EMAIL_PASSWORD);
  }

  /**
   * Custom validator to check if password and confirm password match
   */
  private passwordMatchValidator(form: FormGroup) {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;

    if (password !== confirmPassword) {
      form.get('confirmPassword')?.setErrors({ passwordMismatch: true });
      return { passwordMismatch: true };
    }

    return null;
  }

  /**
   * Submit the signup form
   */
  public onSubmit(): void {
    if (this.signupForm.valid) {
      const { email, password } = this.signupForm.value;
      this.authStore.signUpWithEmail(email, password);
    }
  }

  /**
   * Signup with a social provider
   * @param provider Social auth provider
   */
  public signupWithSocialProvider(provider: SocialAuthProvider): void {
    this.authStore.signInWithSocialProvider(provider);
  }

  /**
   * Helper to check if a provider is enabled
   * @param provider Auth provider
   * @returns True if the provider is enabled, false otherwise
   */
  public isProviderEnabled(provider: AuthProvider): boolean {
    return this.enabledProviders.includes(provider);
  }

  public onBackToLogin(): void {
    this.backToLogin.emit();
  }
}
