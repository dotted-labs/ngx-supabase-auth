import { Component, computed, effect, inject, input, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { UserProfileUpdate, SupabaseUser } from '../../models/auth.models';
import { AuthStore } from '../../store/auth.store';
import { toSignal } from '@angular/core/rxjs-interop';
import { SupabaseAuthService } from '../../services/auth.service';

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
   * Whether to show the avatar section
   */
  public showAvatarSection = input(true);

  /**
   * Whether to show the password section
   */
  public showPasswordSection = input(true);

  /**
   * Whether to show the sign out button
   */
  public showSignOut = input(true);

  /**
   * Whether to allow changing the email
   */
  public allowEmailChange = input(false);

  /**
   * Profile form group
   */
  public profileForm: FormGroup;

  /**
   * Password form group
   */
  public passwordForm: FormGroup;

  /**
   * Whether the profile update was successful
   */
  public updateSuccess = signal(false);

  /**
   * Whether the password update was successful
   */
  public passwordUpdateSuccess = signal(false);

  /**
   * Loading state for user data
   */
  public isLoading = computed(() => this.authStore.loading());

  /**
   * User data signal
   */
  public userData = computed(() => this.authStore.user());

  /**
   * URL for the user avatar
   */
  public avatarUrl = computed(() => {
    const user = this.userData();
    if (user?.user_metadata?.['avatar_url']) {
      return user.user_metadata['avatar_url'];
    }
    return 'https://ui-avatars.com/api/?name=User&color=7F9CF5&background=EBF4FF&size=100';
  });

  /**
   * Auth store instance
   */
  public authStore = inject(AuthStore);

  /**
   * Auth service for direct user data access
   */
  private authService = inject(SupabaseAuthService);

  /**
   * Form builder
   */
  private fb = inject(FormBuilder);

  constructor() {
    this.profileForm = this.fb.group({
      name: ['', [Validators.required]],
      email: [{ value: '', disabled: !this.allowEmailChange() }, [Validators.required, Validators.email]],
    });

    this.passwordForm = this.fb.group(
      {
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', [Validators.required]],
      },
      { validators: this.passwordMatchValidator },
    );

    // Subscribe to user changes from authStore
    effect(() => {
      const user = this.authStore.user();
      if (user) {
        this.updateFormWithUserData(user);
      }
    });
  }

  /**
   * Update form with user data
   */
  private updateFormWithUserData(user: SupabaseUser): void {
    this.profileForm.patchValue({
      name: user?.user_metadata?.['name'] || '',
      email: user?.email || '',
    });
  }

  /**
   * Initialize the component
   */
  public ngOnInit(): void {}

  /**
   * Password match validator
   */
  private passwordMatchValidator(group: FormGroup): { [key: string]: any } | null {
    const password = group.get('password')?.value;
    const confirmPassword = group.get('confirmPassword')?.value;

    return password === confirmPassword ? null : { passwordMismatch: true };
  }

  /**
   * Submit the profile form
   */
  public onSubmit(): void {
    if (this.profileForm.valid) {
      const update: UserProfileUpdate = {
        name: this.profileForm.value.name,
      };

      if (this.allowEmailChange() && this.profileForm.get('email')?.enabled) {
        update.email = this.profileForm.value.email;
      }

      this.authStore.updateProfile(update);

      // Show success message temporarily
      this.updateSuccess.set(true);
      setTimeout(() => {
        this.updateSuccess.set(false);
      }, 3000);
    }
  }

  /**
   * Submit the password form
   */
  public onPasswordSubmit(): void {
    if (this.passwordForm.valid) {
      this.authStore.updatePassword({
        password: this.passwordForm.value.password,
      });

      // Show success message temporarily
      this.passwordUpdateSuccess.set(true);
      setTimeout(() => {
        this.passwordUpdateSuccess.set(false);
        this.passwordForm.reset();
      }, 3000);
    }
  }

  /**
   * Handle change avatar click
   */
  public onChangeAvatar(): void {
    // Create a file input element
    const fileInput = document.createElement('input');
    fileInput.type = 'file';
    fileInput.accept = 'image/*';

    // Handle file selection
    fileInput.onchange = async (event) => {
      const target = event.target as HTMLInputElement;
      const file = target.files?.[0];

      if (file) {
        try {
          // Get the user ID
          const userId = this.userData()?.id;
          if (!userId) {
            throw new Error('User not authenticated');
          }

          // Generate a unique file name
          const fileExt = file.name.split('.').pop();
          const fileName = `${Date.now()}.${fileExt}`;
          const filePath = `avatars/${userId}/${fileName}`;

          // Upload the file and get its URL (loading is handled by updateProfile)
          const { url, error } = await this.authService.uploadFile('avatars', filePath, file);

          if (error) {
            throw error;
          }

          if (url) {
            // Update the user's avatar URL in metadata
            await this.authStore.updateProfile({
              avatar_url: url,
            });

            // Show success message temporarily
            this.updateSuccess.set(true);
            setTimeout(() => {
              this.updateSuccess.set(false);
            }, 3000);
          }
        } catch (error) {
          console.error('Error uploading avatar:', error);
          alert('Failed to upload avatar. Please try again.');
        }
      }
    };

    // Trigger file selection dialog
    fileInput.click();
  }

  /**
   * Handle sign out click
   */
  public onSignOut(): void {
    this.authStore.signOut();
  }
}
