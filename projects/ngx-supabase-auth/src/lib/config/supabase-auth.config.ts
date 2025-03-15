import { InjectionToken, Provider, EnvironmentProviders } from '@angular/core';
import { provideHttpClient } from '@angular/common/http';
import { SupabaseAuthConfig, AuthProvider } from '../models/auth.models';

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
  const needsHttpClient = !!config.firstTimeCheckEndpoint;

  const providers: (Provider | EnvironmentProviders)[] = [
    {
      provide: SUPABASE_AUTH_CONFIG,
      useValue: {
        // Default values
        redirectAfterLogin: '/',
        redirectAfterLogout: '/login',
        authRequiredRedirect: '/login',
        authRedirectIfAuthenticated: '/',
        enabledAuthProviders: [],
        firstTimeProfileRedirect: '/complete-profile',
        firstTimeCheckEndpoint: null,
        // Override with provided config
        ...config,
      },
    },
  ];

  // Add HttpClient provider if needed and not already provided
  if (needsHttpClient) {
    console.log('🔌 [provideSupabaseAuth] First-time user check enabled, adding HttpClient provider');
    providers.push(provideHttpClient());
  }

  return providers;
}
