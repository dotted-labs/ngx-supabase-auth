import { Component, inject, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthStore, SUPABASE_AUTH_CONFIG, UserProfileUpdate } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-complete-profile-page',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  template: `
    <div class="flex flex-col items-center justify-center min-h-screen bg-base-200 p-4">
      <div class="card w-full max-w-md bg-base-100 shadow-xl">
        <div class="card-body">
          <h2 class="card-title text-center text-2xl font-bold mb-6">Complete Your Profile</h2>

          @if (error()) {
            <div class="alert alert-error mb-4">
              <span>{{ error() }}</span>
            </div>
          }

          <form [formGroup]="profileForm" (ngSubmit)="onSubmit()">
            <div class="form-control">
              <label class="label">
                <span class="label-text">Full Name</span>
              </label>
              <input type="text" formControlName="name" class="input input-bordered w-full" placeholder="Enter your full name" />
              @if (profileForm.controls.name.invalid && (profileForm.controls.name.dirty || profileForm.controls.name.touched)) {
                <label class="label">
                  <span class="label-text-alt text-error">Full name is required</span>
                </label>
              }
            </div>

            <div class="form-control mt-4">
              <label class="label">
                <span class="label-text">Profile Picture URL (optional)</span>
              </label>
              <input
                type="text"
                formControlName="avatar_url"
                class="input input-bordered w-full"
                placeholder="https://example.com/avatar.jpg"
              />
            </div>

            <div class="form-control mt-6">
              <button type="submit" class="btn btn-primary" [disabled]="profileForm.invalid || loading()">
                @if (loading()) {
                  <span class="loading loading-spinner loading-sm"></span>
                }
                Save Profile
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  `,
})
export class CompleteProfilePageComponent {
  private readonly authStore = inject(AuthStore);
  private readonly router = inject(Router);
  private readonly config = inject(SUPABASE_AUTH_CONFIG);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly profileForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    avatar_url: new FormControl<string>(''),
  });

  constructor() {
    console.log('[CompleteProfilePage] Component initialized');
  }

  /**
   * Submit the profile completion form
   */
  protected async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      console.warn('[CompleteProfilePage] Form is invalid, submission prevented');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    console.log('📝 [CompleteProfilePage] Submitting profile data:', this.profileForm.value);

    try {
      const formValues = this.profileForm.value;
      const profileData: UserProfileUpdate = {
        name: formValues.name || undefined,
        avatar_url: formValues.avatar_url || undefined,
      };

      console.log('👤 [CompleteProfilePage] Calling update profile through store with data:', profileData);
      await this.authStore.updateProfile(profileData);

      // Check for errors in the store
      const storeError = this.authStore.error();
      if (storeError) {
        console.error('[CompleteProfilePage] Error updating profile:', storeError);
        this.error.set(typeof storeError === 'string' ? storeError : 'Failed to update profile');
        this.loading.set(false);
        return;
      }

      console.log('[CompleteProfilePage] Profile updated successfully');

      // Redirect to the main dashboard
      const redirectPath = this.config.redirectAfterLogin || '/';
      console.log(`🔄 [CompleteProfilePage] Redirecting to ${redirectPath}`);
      await this.router.navigate([redirectPath]);
    } catch (err) {
      console.error('[CompleteProfilePage] Exception during profile update:', err);
      this.error.set('An unexpected error occurred');
      this.loading.set(false);
    }
  }
}
