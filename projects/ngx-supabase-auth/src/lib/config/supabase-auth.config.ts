import { InjectionToken, Provider, EnvironmentProviders } from '@angular/core';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { SupabaseAuthConfig, AuthProvider, SocialAuthProvider } from '../models/auth.models';
import { authInterceptor } from '../interceptors/auth.interceptor';

/**
 * Injection token for Supabase Auth configuration
 */
export const SUPABASE_AUTH_CONFIG = new InjectionToken<SupabaseAuthConfig>('SUPABASE_AUTH_CONFIG');

/**
 * Default enabled authentication providers
 */
export const DEFAULT_ENABLED_AUTH_PROVIDERS: AuthProvider[] = [
  AuthProvider.EMAIL_PASSWORD,
  AuthProvider.GOOGLE,
  AuthProvider.FACEBOOK,
  AuthProvider.GITHUB,
  AuthProvider.TWITTER,
  AuthProvider.DISCORD,
];

/**
 * Create provider for Supabase Auth configuration
 * @param config Supabase Auth configuration
 * @returns Array of providers for Supabase Auth configuration
 */
export function provideSupabaseAuth(config: SupabaseAuthConfig): (Provider | EnvironmentProviders)[] {
  // Check if firstTimeCheckEndpoint is configured, which requires HttpClient

  const providers: (Provider | EnvironmentProviders)[] = [
    // Add HttpClient provider with auth interceptor
    provideHttpClient(withInterceptors([authInterceptor])),
    {
      provide: SUPABASE_AUTH_CONFIG,
      useValue: {
        // Default values
        redirectAfterLogin: '/',
        redirectAfterLogout: '/login',
        authRequiredRedirect: '/login',
        desktopAuthRedirect: '/login-desktop',
        enabledAuthProviders: [],
        firstTimeProfileRedirect: '/complete-profile',
        firstTimeCheckEndpoint: null,
        skipFirstTimeCheck: false,
        // Override with provided config
        ...config,
      },
    },
  ];

  return providers;
}
