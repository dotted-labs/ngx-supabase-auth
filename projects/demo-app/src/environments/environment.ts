// Default environment configuration with placeholder values for sensitive data
export const environment = {
  production: false,
  supabase: {
    url: 'https://tiwagdlcxnzfjnncqsrf.supabase.co',
    key: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRpd2FnZGxjeG56ZmpubmNxc3JmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzE0MTU1NDAsImV4cCI6MjA4Njk5MTU0MH0.y9E_zh7Yarpx-RqPKGX21IQc5qXde0lXCZJQkdqi6ls',
  },
  auth: {
    redirectAfterLogin: '/dashboard',
    redirectAfterLogout: '/login',
    authRequiredRedirect: '/login',
    desktopAuthRedirect: '/login-desktop',
    firstTimeProfileRedirect: '/complete-profile',
    generateMagicLinkEndpoint: 'http://localhost:3000/api/generate-magic-link',
    firstTimeCheckEndpoint: 'http://localhost:3000/api/check-first-time',
    electronDeepLinkProtocol: 'ngx-supabase-auth://auth',
  },
};
