import { AuthProvider } from 'ngx-supabase-auth';

// Default production environment configuration with placeholder values
const defaultEnvironment = {
  production: true,
  supabase: {
    url: 'https://example.supabase.co',
    key: 'your-supabase-key',
  },
  auth: {
    redirectAfterLogin: '/dashboard',
    redirectAfterLogout: '/login',
    authRequiredRedirect: '/login',
    authRedirectIfAuthenticated: '/dashboard',
    enabledAuthProviders: [AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE, AuthProvider.GITHUB],
  },
  electron: {
    isElectronMode: true,
    webAppAuthUrl: 'http://localhost:4200/auth',
    deepLinkProtocol: 'ngx-supabase-auth://auth',
  },
};

// Try to import local environment if it exists
let localEnvironment = {};
try {
  // Local environment values might override production values for testing
  // tslint:disable-next-line: no-var-requires
  localEnvironment = require('./environment.local').environment;
} catch (e) {
  console.log('No local environment found for electron production. Using default values.');
}

// Merge the default and local environments, with local taking precedence
export const environment = {
  ...defaultEnvironment,
  ...localEnvironment,
};
