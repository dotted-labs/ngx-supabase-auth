import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { AuthProvider, provideSupabaseAuth } from '@dotted-labs/ngx-supabase-auth';
import { environment } from '../environments/environment';
import { routes } from './app.routes';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideSupabaseAuth({
      supabaseUrl: environment.supabase.url,
      supabaseKey: environment.supabase.key,
      redirectAfterLogin: environment.auth.redirectAfterLogin,
      redirectAfterLogout: environment.auth.redirectAfterLogout,
      authRequiredRedirect: environment.auth.authRequiredRedirect,
      authRedirectIfAuthenticated: environment.auth.authRedirectIfAuthenticated,
      enabledAuthProviders: [AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE],
      firstTimeProfileRedirect: environment.auth.firstTimeProfileRedirect,
      electronDeepLinkProtocol: environment.auth.electronDeepLinkProtocol,
      generateMagicLinkEndpoint: environment.auth.generateMagicLinkEndpoint,
      // firstTimeCheckEndpoint: environment.auth.firstTimeCheckEndpoint,
    }),
  ],
};
