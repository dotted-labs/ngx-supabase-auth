import { Component, inject, input, output, OnInit, signal } from '@angular/core';
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
  selector: 'sup-login-desktop',
  imports: [CommonModule, ReactiveFormsModule, SocialLoginComponent],
  templateUrl: './login-desktop.component.html',
})
export class LoginDesktopComponent implements OnInit {
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
   * Flag to show email/password form
   */
  public showEmailPasswordForm = signal(false);

  /**
   * Event emitted when user clicks forgot password
   */
  public forgotPassword = output<void>();

  /**
   * Event emitted when user clicks signup
   */
  public signup = output<void>();

  /**
   * Form builder
   */
  private fb = inject(FormBuilder);

  constructor() {}

  public ngOnInit(): void {
    // Verify if the email/password is enabled
    this.showEmailPasswordForm.set(this.authStore.enabledAuthProviders().includes(AuthProvider.EMAIL_PASSWORD));
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

  public onGoToSignup(): void {
    this.signup.emit();
  }
}
