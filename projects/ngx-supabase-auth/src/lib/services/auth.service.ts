import { Injectable, inject } from '@angular/core';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { SUPABASE_AUTH_CONFIG } from '../config/supabase-auth.config';
import {
  SupabaseAuthConfig,
  SupabaseUser,
  AuthProvider,
  PasswordResetRequest,
  UpdatePasswordRequest,
  UserProfileUpdate,
  AuthMode,
  ElectronAuthResult,
  SocialAuthProvider,
} from '../models/auth.models';

/**
 * Service for handling authentication operations with Supabase
 */
@Injectable({
  providedIn: 'root',
})
export class SupabaseAuthService {
  private supabase: SupabaseClient;
  private readonly config = inject(SUPABASE_AUTH_CONFIG);
  private readonly router = inject(Router);
  private readonly http = inject(HttpClient);

  constructor() {
    console.log('[SupabaseAuthService] Initializing service');
    this.supabase = createClient(this.config.supabaseUrl, this.config.supabaseKey);

    // Set up auth state change listener
    this.supabase.auth.onAuthStateChange((_, session) => {
      if (session) {
        console.log('🔐 [SupabaseAuthService] Auth state changed, session exists');
      } else {
        console.log('🔐 [SupabaseAuthService] Auth state changed, no session');
      }
    });
  }

  /**
   * Get the current user
   * @returns Promise with the current user or null
   */
  async getCurrentUser(): Promise<SupabaseUser | null> {
    console.log('👤 [SupabaseAuthService] Getting current user');
    const { data } = await this.supabase.auth.getUser();
    if (data.user) {
      console.log(`👤 [SupabaseAuthService] User found: ${data.user.id}`);
    } else {
      console.log('👤 [SupabaseAuthService] No user found');
    }
    return data.user as SupabaseUser;
  }

  /**
   * Check if a user is authenticated
   * @returns Promise with boolean indicating if user is authenticated
   */
  async isAuthenticated(): Promise<boolean> {
    console.log('🔍 [SupabaseAuthService] Checking authentication status');
    const { data } = await this.supabase.auth.getSession();
    const isAuth = !!data.session;
    console.log(`🔍 [SupabaseAuthService] User is authenticated: ${isAuth}`);
    return isAuth;
  }

  /**
   * Check if it's the user's first time accessing the system
   * @param userId The user ID to check
   * @returns Promise with boolean indicating if it's the first time
   */
  async isFirstTimeUser(userId: string): Promise<boolean> {
    if (!this.config.firstTimeCheckEndpoint) {
      console.log('🚧 [SupabaseAuthService] No firstTimeCheckEndpoint configured, skipping check');
      return false;
    }

    try {
      console.log(`🚧 [SupabaseAuthService] Checking if it's the first time for user ${userId}`);
      const response = await firstValueFrom(this.http.get<boolean>(`${this.config.firstTimeCheckEndpoint}?userId=${userId}`));
      console.log(`🚧 [SupabaseAuthService] First time check result: ${!!response}`);
      return !!response;
    } catch (error) {
      console.error('[SupabaseAuthService] Error checking first time status:', error);
      // On error, treat as first time user
      console.log('🚧 [SupabaseAuthService] Error detected, treating as first time user');
      return true;
    }
  }

  /**
   * Handle redirection after auth based on first-time status
   * @param userId The user ID to check
   */
  private async handleAuthRedirect(userId: string): Promise<void> {
    try {
      // Check if we should skip the first-time check
      if (this.config.skipFirstTimeCheck) {
        console.log(`🔄 [SupabaseAuthService] Skipping first-time check as configured`);

        // Go directly to regular auth flow
        if (this.config.redirectAfterLogin) {
          console.log(`🔄 [SupabaseAuthService] Regular auth redirect to ${this.config.redirectAfterLogin}`);
          await this.router.navigate([this.config.redirectAfterLogin]);
        }
        return;
      }

      // Check if this is configured and if it's the user's first time
      if (this.config.firstTimeCheckEndpoint && this.config.firstTimeProfileRedirect) {
        console.log(`🔄 [SupabaseAuthService] Checking first-time status for redirection for user ${userId}`);
        const isFirstTime = await this.isFirstTimeUser(userId);

        if (isFirstTime) {
          console.log(`🔄 [SupabaseAuthService] First time user, redirecting to ${this.config.firstTimeProfileRedirect}`);
          await this.router.navigate([this.config.firstTimeProfileRedirect]);
          return;
        }
      }

      // Regular authentication flow
      if (this.config.redirectAfterLogin) {
        console.log(`🔄 [SupabaseAuthService] Regular auth redirect to ${this.config.redirectAfterLogin}`);
        await this.router.navigate([this.config.redirectAfterLogin]);
      }
    } catch (error) {
      console.error('[SupabaseAuthService] Error during auth redirect:', error);

      // Fallback to regular redirect
      if (this.config.redirectAfterLogin) {
        console.log(`🔄 [SupabaseAuthService] Fallback redirect to ${this.config.redirectAfterLogin}`);
        await this.router.navigate([this.config.redirectAfterLogin]);
      }
    }
  }

  /**
   * Get the authentication mode based on configuration
   * @returns The current authentication mode (WEB or ELECTRON)
   */
  getAuthMode(): AuthMode {
    return this.config.isElectronMode ? AuthMode.ELECTRON : AuthMode.WEB;
  }

  /**
   * Handles authentication for Electron by opening the web app in browser
   * @param path The authentication path to open (login, signup, etc.)
   * @param options Additional query parameters
   * @returns Promise that resolves when auth is initiated
   */
  async openExternalAuthWindow(path: string, options: Record<string, string> = {}): Promise<void> {
    console.log('🌍 [SupabaseAuthService] Opening external auth window', path);

    if (!this.config.webAppAuthUrl) {
      console.error('⚠️ [SupabaseAuthService] webAppAuthUrl is not configured for Electron mode');
      throw new Error('webAppAuthUrl is not configured for Electron mode');
    }

    // Construct URL with desktop=true parameter to indicate Electron auth flow
    const queryParams = new URLSearchParams({
      desktop: 'true',
      ...options,
    });

    const authUrl = `${this.config.webAppAuthUrl}/${path}?${queryParams.toString()}`;

    try {
      // In a real Electron app, this would use Electron's shell.openExternal
      // Here we're just providing the API that would be called from Electron
      window.open(authUrl, '_blank');
      console.log('🔗 [SupabaseAuthService] Opened external auth URL:', authUrl);
    } catch (error) {
      console.error('❌ [SupabaseAuthService] Failed to open external auth window', error);
      throw new Error(`Failed to open auth window: ${(error as Error).message}`);
    }
  }

  /**
   * Verifies a hashed token received from the web application
   * This is used in the Electron flow after the user completes authentication in browser
   * @param hashedToken The hashed token received via deep link
   * @returns Promise with user data or error
   */
  async verifyHashedToken(hashedToken: string): Promise<{ user: SupabaseUser | null; error: Error | null }> {
    console.log('🔑 [SupabaseAuthService] Verifying hashed token');

    try {
      const { data, error } = await this.supabase.auth.verifyOtp({
        token_hash: hashedToken,
        type: 'email',
      });

      if (error) {
        console.error('❌ [SupabaseAuthService] Failed to verify hashed token', error);
        return { user: null, error };
      }

      const user = data.user as SupabaseUser;
      console.log(`✅ [SupabaseAuthService] Successfully verified token for user: ${user.id}`);

      // Handle auth redirect if needed
      if (user && user.id) {
        await this.handleAuthRedirect(user.id);
      }

      return { user, error: null };
    } catch (error) {
      console.error('❌ [SupabaseAuthService] Error verifying hashed token', error);
      return { user: null, error: error as Error };
    }
  }

  /**
   * Process the auth result from deep link (for Electron mode)
   * @param url The deep link URL containing authentication parameters
   * @returns Promise with the authentication result
   */
  async processDeepLinkUrl(url: string): Promise<ElectronAuthResult> {
    console.log('🔄 [SupabaseAuthService] Processing deep link URL', url);

    try {
      // Basic validation
      if (!url || typeof url !== 'string') {
        return { error: 'Invalid URL' };
      }

      // Extract query parameters from the URL
      const urlObj = new URL(url);
      const hashedToken = urlObj.searchParams.get('hashed_token');

      if (!hashedToken) {
        return { error: 'No hashed_token found in URL' };
      }

      return { hashedToken };
    } catch (error) {
      console.error('❌ [SupabaseAuthService] Error processing deep link URL', error);
      return { error: (error as Error).message };
    }
  }

  /**
   * Sign in with email and password
   * Handles both web and Electron modes
   * @param email User email
   * @param password User password
   * @returns Promise with user data or error
   */
  async signInWithEmail(email: string, password: string): Promise<{ user: SupabaseUser | null; error: Error | null }> {
    console.log('🔐 [SupabaseAuthService] Signing in with email');

    // Check if we're in Electron mode
    if (this.getAuthMode() === AuthMode.ELECTRON) {
      try {
        // In Electron mode, we open the external auth window instead
        await this.openExternalAuthWindow('login', { email });

        // In a real implementation, the Electron app would wait for the deep link callback
        // Here we just return a placeholder result as the actual auth will happen asynchronously
        return { user: null, error: null };
      } catch (error) {
        console.error('❌ [SupabaseAuthService] Failed to initiate Electron auth', error);
        return { user: null, error: error as Error };
      }
    }

    // Original web authentication flow
    try {
      const { data, error } = await this.supabase.auth.signInWithPassword({
        email,
        password,
      });

      if (error) {
        console.error('❌ [SupabaseAuthService] Sign in failed', error);
        return { user: null, error };
      }

      const user = data.user as SupabaseUser;
      console.log(`✅ [SupabaseAuthService] User signed in: ${user.id}`);

      // Handle redirection after successful login
      if (user && user.id) {
        await this.handleAuthRedirect(user.id);
      }

      return { user, error: null };
    } catch (error) {
      console.error('❌ [SupabaseAuthService] Sign in error', error);
      return { user: null, error: error as Error };
    }
  }

  /**
   * Sign up with email and password
   * Handles both web and Electron modes
   * @param email User email
   * @param password User password
   * @returns Promise with user data or error
   */
  async signUpWithEmail(email: string, password: string): Promise<{ user: SupabaseUser | null; error: Error | null }> {
    console.log('📝 [SupabaseAuthService] Signing up with email');

    // Check if we're in Electron mode
    if (this.getAuthMode() === AuthMode.ELECTRON) {
      try {
        // In Electron mode, we open the external auth window instead
        await this.openExternalAuthWindow('signup', { email });

        // In a real implementation, the Electron app would wait for the deep link callback
        return { user: null, error: null };
      } catch (error) {
        console.error('❌ [SupabaseAuthService] Failed to initiate Electron signup', error);
        return { user: null, error: error as Error };
      }
    }

    // Original web signup flow
    try {
      const { data, error } = await this.supabase.auth.signUp({
        email,
        password,
      });

      if (error) {
        console.error('❌ [SupabaseAuthService] Sign up failed', error);
        return { user: null, error };
      }

      const user = data.user as SupabaseUser;
      console.log(`✅ [SupabaseAuthService] User signed up: ${user.id}`);

      // Handle redirection after successful signup
      if (user && user.id) {
        await this.handleAuthRedirect(user.id);
      }

      return { user, error: null };
    } catch (error) {
      console.error('❌ [SupabaseAuthService] Sign up error', error);
      return { user: null, error: error as Error };
    }
  }

  /**
   * Sign in with a social provider
   * Handles both web and Electron modes
   * @param provider Social authentication provider
   * @returns Promise with error status
   */
  async signInWithSocialProvider(provider: SocialAuthProvider): Promise<{ error: Error | null }> {
    console.log(`🔐 [SupabaseAuthService] Signing in with ${provider}`);

    // Check if we're in Electron mode
    if (this.getAuthMode() === AuthMode.ELECTRON) {
      try {
        // In Electron mode, we open the external auth window instead
        await this.openExternalAuthWindow('login', { provider });

        // In a real implementation, the Electron app would wait for the deep link callback
        return { error: null };
      } catch (error) {
        console.error(`❌ [SupabaseAuthService] Failed to initiate Electron auth with ${provider}`, error);
        return { error: error as Error };
      }
    }

    // Original web social auth flow
    try {
      const { error } = await this.supabase.auth.signInWithOAuth({
        provider,
        options: {
          redirectTo: window.location.origin,
        },
      });

      if (error) {
        console.error('❌ [SupabaseAuthService] Social sign in failed', error);
        return { error };
      }

      console.log(`✅ [SupabaseAuthService] Social auth initiated with ${provider}`);
      return { error: null };
    } catch (error) {
      console.error('❌ [SupabaseAuthService] Social sign in error', error);
      return { error: error as Error };
    }
  }

  /**
   * Send password reset email
   * @param request Password reset request
   * @returns Promise with result
   */
  async sendPasswordResetEmail(request: PasswordResetRequest): Promise<{ error: Error | null }> {
    try {
      console.log(`🔐 [SupabaseAuthService] Sending password reset email to: ${request.email}`);
      const { error } = await this.supabase.auth.resetPasswordForEmail(request.email);

      if (error) {
        console.error('[SupabaseAuthService] Password reset email error:', error);
      } else {
        console.log(`✅ [SupabaseAuthService] Password reset email sent successfully`);
      }

      return { error };
    } catch (err) {
      console.error('[SupabaseAuthService] Exception during password reset:', err);
      return { error: err as Error };
    }
  }

  /**
   * Update user password
   * @param request Update password request
   * @returns Promise with result
   */
  async updatePassword(request: UpdatePasswordRequest): Promise<{ error: Error | null }> {
    try {
      console.log(`🔐 [SupabaseAuthService] Updating user password`);
      const { error } = await this.supabase.auth.updateUser({
        password: request.password,
      });

      if (error) {
        console.error('[SupabaseAuthService] Update password error:', error);
      } else {
        console.log(`✅ [SupabaseAuthService] Password updated successfully`);
      }

      return { error };
    } catch (err) {
      console.error('[SupabaseAuthService] Exception during password update:', err);
      return { error: err as Error };
    }
  }

  /**
   * Update user profile
   * @param update User profile update data
   * @returns Promise with result
   */
  async updateProfile(update: UserProfileUpdate): Promise<{ error: Error | null }> {
    try {
      console.log(`👤 [SupabaseAuthService] Updating user profile:`, update);
      const { error } = await this.supabase.auth.updateUser({
        data: update,
      });

      if (error) {
        console.error('[SupabaseAuthService] Update profile error:', error);
      } else {
        console.log(`✅ [SupabaseAuthService] Profile updated successfully`);
      }

      return { error };
    } catch (err) {
      console.error('[SupabaseAuthService] Exception during profile update:', err);
      return { error: err as Error };
    }
  }

  /**
   * Sign out the current user
   * @returns Promise with result
   */
  async signOut(): Promise<{ error: Error | null }> {
    try {
      console.log(`🔐 [SupabaseAuthService] Signing out user`);
      const { error } = await this.supabase.auth.signOut();

      if (error) {
        console.error('[SupabaseAuthService] Sign out error:', error);
      } else {
        console.log(`✅ [SupabaseAuthService] User signed out successfully`);
        if (this.config.redirectAfterLogout) {
          console.log(`🔄 [SupabaseAuthService] Redirecting to ${this.config.redirectAfterLogout}`);
          await this.router.navigate([this.config.redirectAfterLogout]);
        }
      }

      return { error };
    } catch (err) {
      console.error('[SupabaseAuthService] Exception during sign out:', err);
      return { error: err as Error };
    }
  }

  /**
   * Upload a file to Supabase storage
   * @param bucketName The storage bucket name
   * @param filePath The path where the file will be stored
   * @param file The file to upload
   * @returns Promise with upload result
   */
  async uploadFile(bucketName: string, filePath: string, file: File): Promise<{ url: string | null; error: Error | null }> {
    try {
      console.log(`📁 [SupabaseAuthService] Uploading file to ${bucketName}/${filePath}`);
      // Upload the file
      const { error: uploadError } = await this.supabase.storage.from(bucketName).upload(filePath, file, {
        upsert: true,
      });

      if (uploadError) {
        console.error('[SupabaseAuthService] File upload error:', uploadError);
        return { url: null, error: uploadError };
      }

      // Get the public URL
      const { data } = this.supabase.storage.from(bucketName).getPublicUrl(filePath);
      console.log(`✅ [SupabaseAuthService] File uploaded successfully, URL: ${data.publicUrl}`);

      return { url: data.publicUrl, error: null };
    } catch (err) {
      console.error('[SupabaseAuthService] Exception during file upload:', err);
      return { url: null, error: err as Error };
    }
  }
}
