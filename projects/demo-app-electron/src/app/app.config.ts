import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { AuthProvider, provideSupabaseAuth } from '@dotted-labs/ngx-supabase-auth';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    provideSupabaseAuth({
      supabaseUrl: environment.supabase.url,
      supabaseKey: environment.supabase.key,
      redirectAfterLogin: environment.auth.redirectAfterLogin,
      redirectAfterLogout: environment.auth.redirectAfterLogout,
      authRequiredRedirect: environment.auth.authRequiredRedirect,
      authRedirectIfAuthenticated: environment.auth.authRedirectIfAuthenticated,
      enabledAuthProviders: [AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE, AuthProvider.GITHUB],
      webAppAuthUrl: environment.electron.webAppAuthUrl,
      electronDeepLinkProtocol: environment.electron.deepLinkProtocol,
    }),
  ],
};
