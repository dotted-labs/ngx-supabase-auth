/**
 * Authentication configuration interface
 */
export interface SupabaseAuthConfig {
  /**
   * Supabase project URL
   */
  supabaseUrl: string;

  /**
   * Supabase API key
   */
  supabaseKey: string;

  /**
   * Redirect path after successful login
   */
  redirectAfterLogin?: string;

  /**
   * Redirect path after logout
   */
  redirectAfterLogout?: string;

  /**
   * Redirect path when authentication is required
   */
  authRequiredRedirect?: string;

  /**
   * Redirect path when user should not be authenticated
   */
  authRedirectIfAuthenticated?: string;
}

/**
 * User model representing Supabase user data
 */
export interface SupabaseUser {
  id: string;
  email?: string;
  phone?: string;
  created_at: string;
  last_sign_in_at?: string;
  user_metadata?: Record<string, any>;
  app_metadata?: Record<string, any>;
}

/**
 * Authentication state interface
 */
export interface AuthState {
  user: SupabaseUser | null;
  loading: boolean;
  error: string | null;
}

/**
 * Social auth providers enum
 */
export enum SocialAuthProvider {
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  GITHUB = 'github',
  DISCORD = 'discord',
}

/**
 * Password reset request interface
 */
export interface PasswordResetRequest {
  email: string;
}

/**
 * Update password request interface
 */
export interface UpdatePasswordRequest {
  password: string;
}

/**
 * User profile update interface
 */
export interface UserProfileUpdate {
  email?: string;
  name?: string;
  avatar_url?: string;
  [key: string]: any;
}
