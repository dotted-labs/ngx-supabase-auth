import { Routes } from '@angular/router';
import { AuthHandlerComponent } from './auth-handler/auth-handler.component';
import { DashboardComponent } from './dashboard/dashboard.component';
import { authGuard, unauthGuard } from '@dotted-labs/ngx-supabase-auth';

export const routes: Routes = [
  {
    path: '',
    component: AuthHandlerComponent,
  },
  {
    path: 'auth',
    component: AuthHandlerComponent,
  },
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
  },
  {
    path: 'profile',
    // Lazy loading del componente de perfil de la librería
    loadComponent: () => import('@dotted-labs/ngx-supabase-auth').then((m) => m.ProfileComponent),
    canActivate: [authGuard],
  },
  {
    path: '**',
    redirectTo: '',
  },
];
