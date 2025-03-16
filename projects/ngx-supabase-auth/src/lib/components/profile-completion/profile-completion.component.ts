import { Component, inject, signal, computed } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { SupabaseAuthService } from '../../services/auth.service';
import { SUPABASE_AUTH_CONFIG } from '../../config/supabase-auth.config';
import { UserProfileUpdate } from '../../models/auth.models';

@Component({
  selector: 'ngx-profile-completion',
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
export class ProfileCompletionComponent {
  private readonly authService = inject(SupabaseAuthService);
  private readonly router = inject(Router);
  private readonly config = inject(SUPABASE_AUTH_CONFIG);

  protected readonly loading = signal(false);
  protected readonly error = signal<string | null>(null);

  protected readonly profileForm = new FormGroup({
    name: new FormControl<string>('', [Validators.required]),
    avatar_url: new FormControl<string>(''),
  });

  constructor() {
    console.log('[ProfileCompletion] Component initialized');
  }

  /**
   * Submit the profile completion form
   */
  protected async onSubmit(): Promise<void> {
    if (this.profileForm.invalid) {
      console.warn('[ProfileCompletion] Form is invalid, submission prevented');
      return;
    }

    this.loading.set(true);
    this.error.set(null);

    console.log('📝 [ProfileCompletion] Submitting profile data:', this.profileForm.value);

    try {
      const formValues = this.profileForm.value;
      const profileData: UserProfileUpdate = {
        name: formValues.name || undefined,
        avatar_url: formValues.avatar_url || undefined,
      };

      console.log('👤 [ProfileCompletion] Calling update profile service with data:', profileData);
      const { error } = await this.authService.updateProfile(profileData);

      if (error) {
        console.error('[ProfileCompletion] Error updating profile:', error);
        this.error.set(error.message || 'Failed to update profile');
        this.loading.set(false);
        return;
      }

      console.log('[ProfileCompletion] Profile updated successfully');

      // Redirect to the main dashboard
      const redirectPath = this.config.redirectAfterLogin || '/';
      console.log(`🔄 [ProfileCompletion] Redirecting to ${redirectPath}`);
      this.router.navigate([redirectPath]);
    } catch (err) {
      console.error('[ProfileCompletion] Exception during profile update:', err);
      this.error.set('An unexpected error occurred');
      this.loading.set(false);
    }
  }
}
