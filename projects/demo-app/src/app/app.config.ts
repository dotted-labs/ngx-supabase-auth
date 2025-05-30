import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthProvider, provideSupabaseAuth } from '@dotted-labs/ngx-supabase-auth';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

/**
 * Creates and configures the Supabase client instance in your main application
 * This ensures a single client instance is used throughout the application
 */
function createSupabaseClient(): SupabaseClient {
  return createClient(environment.supabase.url, environment.supabase.key);
}

// Create the single Supabase client instance for the entire app
const supabaseClient = createSupabaseClient();

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideSupabaseAuth({
      supabaseClient: supabaseClient, // Pass the single client instance created in your app
      redirectAfterLogin: environment.auth.redirectAfterLogin,
      redirectAfterLogout: environment.auth.redirectAfterLogout,
      authRequiredRedirect: environment.auth.authRequiredRedirect,
      enabledAuthProviders: [AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE],
      firstTimeProfileRedirect: environment.auth.firstTimeProfileRedirect,
      electronDeepLinkProtocol: environment.auth.electronDeepLinkProtocol,
      generateMagicLinkEndpoint: environment.auth.generateMagicLinkEndpoint,
      // firstTimeCheckEndpoint: environment.auth.firstTimeCheckEndpoint,
    }),
  ],
};

// Export the supabaseClient so it can be used elsewhere in the app
// for database operations, storage, etc.
export { supabaseClient };
