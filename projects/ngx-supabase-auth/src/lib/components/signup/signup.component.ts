import { CommonModule } from '@angular/common';
import { Component, computed, inject, output } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SUPABASE_AUTH_CONFIG } from '../../config/supabase-auth.config';
import { AuthProvider, SocialAuthProvider } from '../../models/auth.models';
import { AuthStore } from '../../store/auth.store';
import { SocialLoginComponent } from '../social-login/social-login.component';

/**
 * Signup component to handle email/password registration and social signup
 */
@Component({
  selector: 'sup-signup',
  imports: [CommonModule, ReactiveFormsModule, SocialLoginComponent],
  templateUrl: './signup.component.html',
})
export class SignupComponent {
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
   * Flag to show email/password form
   */
  public showEmailPasswordForm = computed(() => this.authStore.hasEmailPasswordProvider());

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

  public onBackToLogin(): void {
    this.backToLogin.emit();
  }
}
