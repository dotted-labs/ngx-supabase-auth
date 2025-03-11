import { InjectionToken, Provider } from '@angular/core';
import { SupabaseAuthConfig } from '../models/auth.models';

/**
 * Injection token for Supabase Auth configuration
 */
export const SUPABASE_AUTH_CONFIG = new InjectionToken<SupabaseAuthConfig>(
  'SUPABASE_AUTH_CONFIG'
);

/**
 * Create provider for Supabase Auth configuration
 * @param config Supabase Auth configuration
 * @returns Provider for Supabase Auth configuration
 */
export function provideSupabaseAuth(config: SupabaseAuthConfig): Provider {
  return {
    provide: SUPABASE_AUTH_CONFIG,
    useValue: {
      // Default values
      redirectAfterLogin: '/',
      redirectAfterLogout: '/login',
      authRequiredRedirect: '/login',
      authRedirectIfAuthenticated: '/',
      // Override with provided config
      ...config,
    },
  };
}
