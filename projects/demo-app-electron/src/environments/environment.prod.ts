// Default production environment configuration with placeholder values
export const environment = {
  production: true,
  supabase: {
    url: 'https://chayrsrhmqflptnwdhuu.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoYXlyc3JobXFmbHB0bndkaHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDQyNTQsImV4cCI6MjAzOTU4MDI1NH0.wyOS8cwL9i1NN2-OAt5uqC3U-1MgZX9Aix0dfvrZQBE',
  },
  auth: {
    redirectAfterLogin: '/dashboard',
    redirectAfterLogout: '/login',
    authRequiredRedirect: '/login',
    authRedirectIfAuthenticated: '/dashboard',
  },
  electron: {
    isElectronMode: true,
    webAppAuthUrl: 'http://localhost:4200',
    deepLinkProtocol: 'ngx-supabase-auth://auth',
  },
};
