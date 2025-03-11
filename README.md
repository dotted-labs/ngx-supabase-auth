# ngx-supabase-auth

An Angular library for handling authentication with Supabase. This library provides ready-to-use components, services and guards for implementing authentication in Angular applications using Supabase as the backend.

## Features

- 🔑 Authentication components (Login, Password Reset, Profile)
- 🔒 Authentication guards for route protection
- 📊 State management using ngrx/signals
- 🌈 Social login support (Google, Facebook, Twitter, GitHub)
- 📱 Responsive design
- 🎨 Customizable components
- 📝 TypeScript types for all features

## Installation

```bash
npm install @dotted-labs/ngx-supabase-auth
```

## Setup

First, configure the library in your `app.config.ts`:

```typescript
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { routes } from './app.routes';
import { provideSupabaseAuth } from '@dotted-labs/ngx-supabase-auth';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideSupabaseAuth({
      supabaseUrl: 'YOUR_SUPABASE_URL',
      supabaseKey: 'YOUR_SUPABASE_API_KEY',
      redirectAfterLogin: '/dashboard',
      redirectAfterLogout: '/login',
      authRequiredRedirect: '/login',
      authRedirectIfAuthenticated: '/dashboard'
    })
  ]
};
```

## Quick Start

### 1. Create Login Page

```typescript
import { Component } from '@angular/core';
import { LoginComponent } from '@dotted-labs/ngx-supabase-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [LoginComponent],
  template: `
    <div class="container">
      <sup-login
        (forgotPassword)="onForgotPassword()"
        (signUp)="onSignUp()"
      ></sup-login>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class LoginPageComponent {
  constructor(private router: Router) {}

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }
  
  onSignUp() {
    this.router.navigate(['/signup']);
  }
}
```

### 2. Create Password Reset Page

```typescript
import { Component } from '@angular/core';
import { PasswordResetComponent } from '@dotted-labs/ngx-supabase-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [PasswordResetComponent],
  template: `
    <div class="container">
      <sup-password-reset
        (backToLogin)="onBackToLogin()"
      ></sup-password-reset>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class PasswordResetPageComponent {
  constructor(private router: Router) {}

  onBackToLogin() {
    this.router.navigate(['/login']);
  }
}
```

### 3. Create Profile Page

```typescript
import { Component } from '@angular/core';
import { ProfileComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileComponent],
  template: `
    <div class="container">
      <sup-profile></sup-profile>
    </div>
  `,
  styles: [`
    .container {
      padding: 2rem;
      max-width: 1200px;
      margin: 0 auto;
    }
  `]
})
export class ProfilePageComponent {}
```

### 4. Set Up Routes

```typescript
import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page.component';
import { PasswordResetPageComponent } from './pages/password-reset-page.component';
import { ProfilePageComponent } from './pages/profile-page.component';
import { DashboardComponent } from './pages/dashboard.component';
import { authGuard, unauthGuard } from '@dotted-labs/ngx-supabase-auth';

export const routes: Routes = [
  { 
    path: 'login', 
    component: LoginPageComponent,
    canActivate: [unauthGuard]
  },
  { 
    path: 'forgot-password', 
    component: PasswordResetPageComponent,
    canActivate: [unauthGuard]
  },
  { 
    path: 'profile', 
    component: ProfilePageComponent,
    canActivate: [authGuard]
  },
  { 
    path: 'dashboard', 
    component: DashboardComponent,
    canActivate: [authGuard]
  },
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];
```

## Building and Testing

To build the library:

```bash
ng build ngx-supabase-auth
```

## Documentation

For detailed documentation and API references, please see the [library README](./projects/ngx-supabase-auth/README.md).

## Demo Application

Este repositorio incluye una aplicación de demostración que muestra cómo implementar la biblioteca en un proyecto real. Para más detalles, consulta el [README de la aplicación demo](./projects/demo-app/README.md).

Para ejecutar la aplicación de demostración:

```bash
# Instalar dependencias
npm install

# Ejecutar la aplicación de demostración
ng serve demo-app
```

Luego, abre tu navegador en `http://localhost:4200`.

## License
