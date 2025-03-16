import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { provideSupabaseAuth, AuthProvider } from '@dotted-labs/ngx-supabase-auth';

import { routes } from './app.routes';

// Configuración para el entorno de Electron
// ¡IMPORTANTE! Reemplazar estos valores con tus propias credenciales de Supabase antes de usar la aplicación
const SUPABASE_URL = 'https://example.supabase.co'; // Reemplazar con URL real de Supabase
const SUPABASE_KEY =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImV4YW1wbGUiLCJyb2xlIjoiYW5vbiIsImlhdCI6MTYyMjYxMDUwMCwiZXhwIjoxOTM4MTg2NTAwfQ.exampletoken'; // Reemplazar con clave API real de Supabase
const WEB_APP_AUTH_URL = 'http://localhost:4200/auth'; // URL de la web para manejar autenticación
const DEEP_LINK_PROTOCOL = 'ngx-supabase-auth://auth'; // Protocolo de deep link

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes),
    provideHttpClient(),
    provideSupabaseAuth({
      supabaseUrl: SUPABASE_URL,
      supabaseKey: SUPABASE_KEY,
      redirectAfterLogin: '/dashboard',
      redirectAfterLogout: '/login',
      authRequiredRedirect: '/login',
      authRedirectIfAuthenticated: '/dashboard',
      enabledAuthProviders: [AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE, AuthProvider.GITHUB],

      // Configuración para Electron
      isElectronMode: true,
      webAppAuthUrl: WEB_APP_AUTH_URL,
      electronDeepLinkProtocol: DEEP_LINK_PROTOCOL,
    }),
  ],
};
