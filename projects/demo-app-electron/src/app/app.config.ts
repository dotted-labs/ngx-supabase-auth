import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { routes } from './app.routes';
import { AuthProvider, provideSupabaseAuth } from '@dotted-labs/ngx-supabase-auth';
import { environment } from '../environments/environment';

/**
 * Creates and configures the Supabase client instance in your main Electron application
 * This ensures a single client instance is used throughout the Electron application
 */
function createSupabaseClient(): SupabaseClient {
  return createClient(environment.supabase.url, environment.supabase.key);
}

// Create the single Supabase client instance for the entire Electron app
const supabaseClient = createSupabaseClient();

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideSupabaseAuth({
      supabaseClient: supabaseClient, // Pass the single client instance created in your app
      redirectAfterLogin: environment.auth.redirectAfterLogin,
      redirectAfterLogout: environment.auth.redirectAfterLogout,
      authRequiredRedirect: environment.auth.authRequiredRedirect,
      enabledAuthProviders: [AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE, AuthProvider.GITHUB],
      webAppAuthUrl: environment.electron.webAppAuthUrl,
      electronDeepLinkProtocol: environment.electron.deepLinkProtocol,
    }),
  ],
};

// Export the supabaseClient so it can be used elsewhere in the Electron app
// for database operations, storage, etc.
export { supabaseClient };
