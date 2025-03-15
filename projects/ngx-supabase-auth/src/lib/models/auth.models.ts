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

  /**
   * Enabled authentication providers
   */
  enabledAuthProviders?: AuthProvider[];

  /**
   * Redirect path for first-time users to complete their profile
   */
  firstTimeProfileRedirect?: string;

  /**
   * Endpoint URL to check if it's the user's first time
   * Should return a boolean (true if it's the first time)
   */
  firstTimeCheckEndpoint?: string | null;
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
 * Auth providers enum
 */
export enum AuthProvider {
  EMAIL_PASSWORD = 'email_password',
  GOOGLE = 'google',
  FACEBOOK = 'facebook',
  TWITTER = 'twitter',
  GITHUB = 'github',
  DISCORD = 'discord',
}

/**
 * Social auth providers enum
 * @deprecated Use AuthProvider instead
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
