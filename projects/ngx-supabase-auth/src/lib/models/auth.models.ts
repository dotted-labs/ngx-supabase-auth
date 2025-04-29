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
   * Redirect path for desktop login
   */
  desktopAuthRedirect?: string;

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

  /**
   * Endpoint URL to generate magic link
   */
  generateMagicLinkEndpoint?: string | null;

  /**
   * Skip the first-time user check and always treat users as returning users
   * When true, the firstTimeCheckEndpoint will not be called
   */
  skipFirstTimeCheck?: boolean;

  /**
   * Enable electron-specific authentication flow
   * When true, it assumes the app is running in an Electron context
   */
  isElectronMode?: boolean;

  /**
   * URL of the web application for handling Electron auth
   * Used when isElectronMode is true to redirect to the web app
   */
  webAppAuthUrl?: string;

  /**
   * Deep link protocol for Electron app
   * Example: 'myapp://auth'
   */
  electronDeepLinkProtocol?: string;

  /**
   * URL to generate magic link tokens for Electron auth flow
   * This should be a secure API endpoint that uses the admin Supabase client
   */
  magicLinkGeneratorUrl?: string;
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
  enabledAuthProviders: AuthProvider[];
  redirectToDesktopAfterLogin: boolean;
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

export enum AuthProvider {
  EMAIL_PASSWORD = 'email_password',
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

/**
 * Authentication mode enum
 */
export enum AuthMode {
  WEB = 'web',
  ELECTRON = 'electron',
}

/**
 * Electron auth result interface
 */
export interface ElectronAuthResult {
  hashedToken?: string;
  error?: string;
}
