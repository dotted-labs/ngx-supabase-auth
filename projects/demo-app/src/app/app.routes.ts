import { Routes } from '@angular/router';
import { authGuard, unauthGuard } from '@dotted-labs/ngx-supabase-auth';
import { DashboardComponent } from './pages/dashboard/dashboard.component';
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
    canActivate: [authGuard],
  },
  {
    path: 'signup',
    component: SignupPageComponent,
    canActivate: [unauthGuard],
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' },
  { path: '**', redirectTo: '/login' },
];
