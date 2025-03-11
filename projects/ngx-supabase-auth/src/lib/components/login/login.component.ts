import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { SocialAuthProvider } from '../../models/auth.models';
import { AuthStore } from '../../store/auth.store';

/**
 * Login component to handle email/password and social login
 */
@Component({
  selector: 'sup-login',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
})
export class LoginComponent {
  /**
   * Title for the login component
   */
  @Input() title = 'Login';

  /**
   * Subtitle for the login component
   */
  @Input() subtitle?: string;

  /**
   * Whether to show social login options
   */
  @Input() showSocialLogins = true;

  /**
   * Whether to show the forgot password link
   */
  @Input() showForgotPassword = true;

  /**
   * Whether to show the sign up link
   */
  @Input() showSignUpLink = true;

  /**
   * Array of social providers to enable
   * Default includes all available providers
   */
  @Input() enabledSocialProviders: SocialAuthProvider[] = [
    SocialAuthProvider.GOOGLE,
    SocialAuthProvider.FACEBOOK,
    SocialAuthProvider.GITHUB,
    SocialAuthProvider.TWITTER,
    SocialAuthProvider.DISCORD,
  ];

  /**
   * Event emitted when user clicks forgot password
   */
  @Output() forgotPassword = new EventEmitter<void>();

  /**
   * Event emitted when user clicks sign up
   */
  @Output() signUp = new EventEmitter<void>();

  /**
   * Login form group
   */
  loginForm: FormGroup;

  /**
   * Auth store instance
   */
  authStore = inject(AuthStore);

  /**
   * Social auth provider enum
   */
  SocialAuthProvider = SocialAuthProvider;

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

  /**
   * Submit the login form
   */
  onSubmit(): void {
    if (this.loginForm.valid) {
      const { email, password } = this.loginForm.value;
      this.authStore.signInWithEmail(email, password);
    }
  }

  /**
   * Login with a social provider
   * @param provider Social auth provider
   */
  loginWithSocialProvider(provider: SocialAuthProvider): void {
    this.authStore.signInWithSocialProvider(provider);
  }

  /**
   * Handle forgot password click
   */
  onForgotPassword(): void {
    this.forgotPassword.emit();
  }

  /**
   * Handle sign up click
   */
  onSignUp(): void {
    this.signUp.emit();
  }
}
