/*
 * Public API Surface of ngx-supabase-auth
 */

// Configuration
export * from './lib/config/supabase-auth.config';

// Models
export * from './lib/models/auth.models';

// Services
export * from './lib/services/auth.service';

// Store
export * from './lib/store/auth.store';

// Guards
export * from './lib/guards/auth.guard';
export * from './lib/guards/unauth.guard';
export * from './lib/guards/first-time-profile.guard';
export * from './lib/guards/not-first-time-profile.guard';
export * from './lib/guards/is-desktop-login.guard';
export * from './lib/guards/is-not-desktop-login.guard';

// Components
export * from './lib/components/login/login.component';
export * from './lib/components/login-desktop/login-desktop.component';
export * from './lib/components/signup/signup.component';
export * from './lib/components/password-reset/password-reset.component';
export * from './lib/components/profile/profile.component';
export * from './lib/components/social-login/social-login.component';
