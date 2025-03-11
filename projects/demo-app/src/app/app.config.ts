import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideSupabaseAuth, AuthProvider } from '@dotted-labs/ngx-supabase-auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    // Add the Supabase Auth provider
    provideSupabaseAuth({
      // NOTA: En un caso real, estas credenciales deberían estar en un archivo de entorno
      // Para esta demo, usamos valores de ejemplo
      supabaseUrl: 'https://chayrsrhmqflptnwdhuu.supabase.co',
      supabaseKey:
        'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoYXlyc3JobXFmbHB0bndkaHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDQyNTQsImV4cCI6MjAzOTU4MDI1NH0.wyOS8cwL9i1NN2-OAt5uqC3U-1MgZX9Aix0dfvrZQBE',
      redirectAfterLogin: '/dashboard',
      redirectAfterLogout: '/login',
      authRequiredRedirect: '/login',
      authRedirectIfAuthenticated: '/dashboard',
      enabledAuthProviders: [AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE],
    }),
  ],
};
