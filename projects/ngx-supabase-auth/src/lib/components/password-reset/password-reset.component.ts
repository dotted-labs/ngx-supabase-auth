import { Component, inject, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { PasswordResetRequest } from '../../models/auth.models';
import { AuthStore } from '../../store/auth.store';

/**
 * Password reset component for handling password recovery
 */
@Component({
  selector: 'sup-password-reset',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './password-reset.component.html',
})
export class PasswordResetComponent {
  /**
   * Title for the password reset component
   */
  @Input() title = 'Reset Password';

  /**
   * Subtitle for the password reset component
   */
  @Input() subtitle?: string;

  /**
   * Event emitted when user clicks back to login
   */
  @Output() backToLogin = new EventEmitter<void>();

  /**
   * Password reset form group
   */
  resetForm: FormGroup;

  /**
   * Whether the reset email has been sent
   */
  resetEmailSent = false;

  /**
   * Auth store instance
   */
  authStore = inject(AuthStore);

  /**
   * Form builder
   */
  private fb = inject(FormBuilder);

  constructor() {
    this.resetForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  /**
   * Submit the password reset form
   */
  onSubmit(): void {
    if (this.resetForm.valid) {
      const request: PasswordResetRequest = {
        email: this.resetForm.value.email,
      };

      this.authStore.sendPasswordResetEmail(request);

      // Simulate a successful password reset request
      // In a real app, you'd check for errors before showing success
      setTimeout(() => {
        if (!this.authStore.error()) {
          this.resetEmailSent = true;
        }
      }, 1000);
    }
  }

  /**
   * Handle back to login click
   */
  onBackToLogin(): void {
    this.backToLogin.emit();
  }
}
