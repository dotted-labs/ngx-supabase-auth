import { Routes } from '@angular/router';
import {
  authGuard,
  firstTimeProfileGuard,
  isDesktopLoginGuard,
  isNotDesktopLoginGuard,
  notFirstTimeProfileGuard,
  unauthGuard,
} from '@dotted-labs/ngx-supabase-auth';
import { CompleteProfilePageComponent } from './pages/complete-profile/complete-profile.component';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
import { LoginDesktopPageComponent } from './pages/login-desktop/login-desktop.component';
import { LoginPageComponent } from './pages/login/login.component';
import { PasswordResetPageComponent } from './pages/password-reset/password-reset.component';
import { ProfilePageComponent } from './pages/profile/profile.component';
import { SignupPageComponent } from './pages/signup/signup.component';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [unauthGuard],
  },
  {
    path: 'login-desktop',
    component: LoginDesktopPageComponent,
    canActivate: [authGuard],
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
    path: 'complete-profile',
    component: CompleteProfilePageComponent,
    canActivate: [authGuard, notFirstTimeProfileGuard],
  },
  {
    path: 'signup',
    component: SignupPageComponent,
    canActivate: [unauthGuard],
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard, firstTimeProfileGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
