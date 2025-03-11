import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import {
  SupabaseAuthConfig,
  SupabaseUser,
  SocialAuthProvider,
  PasswordResetRequest,
  UpdatePasswordRequest,
  UserProfileUpdate,
} from '../models/auth.models';

/**
 * Service for handling authentication operations with Supabase
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  private supabase: SupabaseClient;
  private config = inject(SUPABASE_AUTH_CONFIG);
  private router = inject(Router);

  constructor() {
    this.supabase = createClient(
      this.config.supabaseUrl,
      this.config.supabaseKey
    );

    // Set up auth state change listener
    this.supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        // Handle session change
      }
    });
  }

  /**
   * Get the current user
   * @returns Promise with the current user or null
   */
  async getCurrentUser(): Promise<SupabaseUser | null> {
    const { data } = await this.supabase.auth.getUser();
    return data.user as SupabaseUser;
  }

  /**
   * Check if a user is authenticated
   * @returns Promise with boolean indicating if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    const { data } = await this.supabase.auth.getSession();
    return !!data.session;
  }

  /**
   * Sign in with email and password
   * @param email User email
   * @param password User password
   * @returns Promise with sign in result
   */
  async signInWithEmail(
    email: string,
    password: string
  ): Promise<{ user: SupabaseUser | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      if (this.config.redirectAfterLogin) {
        await this.router.navigate([this.config.redirectAfterLogin]);
      }

      return { user: data.user as SupabaseUser, error: null };
    } catch (err) {
      return { user: null, error: err as Error };
    }
  }

  /**
   * Sign up with email and password
   * @param email User email
   * @param password User password
   * @returns Promise with sign up result
   */
  async signUpWithEmail(
    email: string,
    password: string
  ): Promise<{ user: SupabaseUser | null; error: Error | null }> {
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        return { user: null, error };
      }

      return { user: data.user as SupabaseUser, error: null };
    } catch (err) {
      return { user: null, error: err as Error };
    }
  }

  /**
   * Sign in with a social provider
   * @param provider Social auth provider
   * @returns Promise with sign in result
   */
  async signInWithSocialProvider(
    provider: SocialAuthProvider
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider: provider,
      });

      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  }

  /**
   * Send password reset email
   * @param request Password reset request
   * @returns Promise with result
   */
  async sendPasswordResetEmail(
    request: PasswordResetRequest
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.auth.resetPasswordForEmail(
        request.email
      );
      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  }

  /**
   * Update user password
   * @param request Update password request
   * @returns Promise with result
   */
  async updatePassword(
    request: UpdatePasswordRequest
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        password: request.password,
      });

      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  }

  /**
   * Update user profile
   * @param update User profile update data
   * @returns Promise with result
   */
  async updateProfile(
    update: UserProfileUpdate
  ): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.auth.updateUser({
        data: update,
      });

      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  }

  /**
   * Sign out the current user
   * @returns Promise with result
   */
  async signOut(): Promise<{ error: Error | null }> {
    try {
      const { error } = await this.supabase.auth.signOut();

      if (!error && this.config.redirectAfterLogout) {
        await this.router.navigate([this.config.redirectAfterLogout]);
      }

      return { error };
    } catch (err) {
      return { error: err as Error };
    }
  }
}
