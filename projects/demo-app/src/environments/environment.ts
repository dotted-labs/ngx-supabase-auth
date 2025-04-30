// Default environment configuration with placeholder values for sensitive data
export const environment = {
  production: false,
  supabase: {
    url: 'https://chayrsrhmqflptnwdhuu.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImNoYXlyc3JobXFmbHB0bndkaHV1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3MjQwMDQyNTQsImV4cCI6MjAzOTU4MDI1NH0.wyOS8cwL9i1NN2-OAt5uqC3U-1MgZX9Aix0dfvrZQBE',
  },
  auth: {
    redirectAfterLogin: '/dashboard',
    redirectAfterLogout: '/login',
    authRequiredRedirect: '/login',
    desktopAuthRedirect: '/login-desktop',
    firstTimeProfileRedirect: '/complete-profile',
    generateMagicLinkEndpoint: 'http://localhost:3000/api/generate-magic-link',
    // firstTimeCheckEndpoint: 'https://api.example.com/check-first-time',
    electronDeepLinkProtocol: 'ngx-supabase-auth://auth',
  },
};
