import { Component, inject, Input, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UserProfileUpdate } from '../../models/auth.models';
import { AuthStore } from '../../store/auth.store';

/**
 * User profile component for managing user information
 */
@Component({
  selector: 'sup-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
})
export class ProfileComponent implements OnInit {
  /**
   * Title for the profile component
   */
  @Input() title = 'User Profile';

  /**
   * Subtitle for the profile component
   */
  @Input() subtitle?: string;

  /**
   * Whether to show the avatar section
   */
  @Input() showAvatarSection = true;

  /**
   * Whether to show the password section
   */
  @Input() showPasswordSection = true;

  /**
   * Whether to show the sign out button
   */
  @Input() showSignOut = true;

  /**
   * Whether to allow changing the email
   */
  @Input() allowEmailChange = false;

  /**
   * Profile form group
   */
  profileForm: FormGroup;

  /**
   * Password form group
   */
  passwordForm: FormGroup;

  /**
   * Whether the profile update was successful
   */
  updateSuccess = false;

  /**
   * Whether the password update was successful
   */
  passwordUpdateSuccess = false;

  /**
   * URL for the user avatar
   */
  avatarUrl =
    'https://ui-avatars.com/api/?name=User&color=7F9CF5&background=EBF4FF&size=100';

  /**
   * Auth store instance
   */
  authStore = inject(AuthStore);

  /**
   * Form builder
   */
  private fb = inject(FormBuilder);

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [
        { value: '', disabled: !this.allowEmailChange },
        [Validators.required, Validators.email],
      ],
    });

    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator }
    );
  }

  /**
   * Initialize the component
   */
  ngOnInit(): void {
    // Set form values from user data
    if (this.authStore.user()) {
      const user = this.authStore.user();

      // Update profile form
      this.profileForm.patchValue({
        name: user?.user_metadata?.['name'] || '',
        email: user?.email || '',
      });

      // Update avatar URL if available
      if (user?.user_metadata?.['avatar_url']) {
        this.avatarUrl = user.user_metadata['avatar_url'];
      } else if (user?.email) {
        // Generate avatar from email if no avatar URL is available
        const name = user.user_metadata?.['name'] || user.email.split('@')[0];
        this.avatarUrl = `https://ui-avatars.com/api/?name=${encodeURIComponent(
          name
        )}&color=7F9CF5&background=EBF4FF&size=100`;
      }
    }
  }

  /**
   * Password match validator
   */
  private passwordMatchValidator(
    group: FormGroup
  ): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Submit the profile form
   */
  onSubmit(): void {
    if (this.profileForm.valid) {
      const update: UserProfileUpdate = {
        name: this.profileForm.value.name,
      };

      if (this.allowEmailChange && this.profileForm.get('email')?.enabled) {
        update.email = this.profileForm.value.email;
      }

      this.authStore.updateProfile(update);

      // Show success message temporarily
      this.updateSuccess = true;
      setTimeout(() => {
        this.updateSuccess = false;
      }, 3000);
    }
  }

  /**
   * Submit the password form
   */
  onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      this.authStore.updatePassword({
        password: this.passwordForm.value.password,
      });

      // Show success message temporarily
      this.passwordUpdateSuccess = true;
      setTimeout(() => {
        this.passwordUpdateSuccess = false;
        this.passwordForm.reset();
      }, 3000);
    }
  }

  /**
   * Handle change avatar click
   */
  onChangeAvatar(): void {
    // In a real implementation, you would show a file picker dialog
    // and upload the image to storage, then update the user metadata
    alert('Avatar upload functionality would be implemented here');
  }

  /**
   * Handle sign out click
   */
  onSignOut(): void {
    this.authStore.signOut();
  }
}
