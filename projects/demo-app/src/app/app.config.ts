import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideSupabaseAuth } from '@dotted-labs/ngx-supabase-auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    // Add the Supabase Auth provider
    provideSupabaseAuth({
      // NOTA: En un caso real, estas credenciales deberían estar en un archivo de entorno
      // Para esta demo, usamos valores de ejemplo
      supabaseUrl: 'https://example.supabase.co',
      supabaseKey: 'your-supabase-key',
      redirectAfterLogin: '/dashboard',
      redirectAfterLogout: '/login',
      authRequiredRedirect: '/login',
      authRedirectIfAuthenticated: '/dashboard',
    }),
  ],
};
