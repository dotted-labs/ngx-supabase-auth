import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';

import { routes } from './app.routes';
import { provideClientHydration } from '@angular/platform-browser';
import { provideSupabaseAuth, AuthProvider } from '@dotted-labs/ngx-supabase-auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideClientHydration(),
    // IMPORTANTE: Proporcionar HttpClient antes que SupabaseAuth
    provideHttpClient(),
    // Add the Supabase Auth provider
    ...provideSupabaseAuth({
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
      // Configuración para comprobar si es la primera vez del usuario
      firstTimeProfileRedirect: '/complete-profile',
      // En un entorno real, esta sería una URL a un endpoint del backend
      // Para esta demo, usaremos una URL de ejemplo
      firstTimeCheckEndpoint: 'https://api.example.com/check-first-time',
    }),
  ],
};
