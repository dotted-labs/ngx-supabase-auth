import { Routes } from '@angular/router';
import {
  authGuard,
  unauthGuard,
  firstTimeProfileGuard,
  notFirstTimeProfileGuard,
  isNotDesktopLoginGuard,
  isDesktopLoginGuard,
} from '@dotted-labs/ngx-supabase-auth';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginPageComponent } from './pages/login/login.component';
import { PasswordResetPageComponent } from './pages/password-reset/password-reset.component';
import { ProfilePageComponent } from './pages/profile/profile.component';
import { SignupPageComponent } from './pages/signup/signup.component';
import { CompleteProfilePageComponent } from './pages/complete-profile/complete-profile.component';
import { LoginDesktopPageComponent } from './pages/login-desktop/login-desktop.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [isDesktopLoginGuard, unauthGuard],
  },
  {
    path: 'login-desktop',
    component: LoginDesktopPageComponent,
    canActivate: [isNotDesktopLoginGuard],
  },
  {
    path: 'forgot-password',
    component: PasswordResetPageComponent,
    canActivate: [unauthGuard],
  },
  {
    path: 'profile',
    component: ProfilePageComponent,
    canActivate: [authGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, firstTimeProfileGuard],
  },
  {
    path: 'complete-profile',
    component: CompleteProfilePageComponent,
    canActivate: [authGuard, notFirstTimeProfileGuard],
  },
  {
    path: 'signup',
    component: SignupPageComponent,
    canActivate: [unauthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
