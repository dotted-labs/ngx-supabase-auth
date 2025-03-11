# ngx-supabase-auth

An Angular library for handling authentication with Supabase. This library provides ready-to-use components, services and guards for implementing authentication in Angular applications using Supabase as the backend.

## Features

- 🔑 Authentication components (Login, Signup, Password Reset, Profile)
- 🔒 Authentication guards for route protection
- 📊 State management using ngrx/signals
- 🌈 Social login support (Google, Facebook, Twitter, GitHub, Discord)
- 📱 Responsive design with Tailwind CSS and DaisyUI
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
      authRedirectIfAuthenticated: '/dashboard',
      enabledAuthProviders: ['email_password', 'google', 'github']
    })
  ]
};
```


## Configuration Options

The following table describes all available options for the `provideSupabaseAuth` function:

| Option | Default Value | Description |
| ------ | ------------- | ----------- |
| `supabaseUrl` | - | Your Supabase project URL |
| `supabaseKey` | - | Your Supabase API key |
| `redirectAfterLogin` | '/' | Path to redirect to after successful login |
| `redirectAfterLogout` | '/login' | Path to redirect to after logout |
| `authRequiredRedirect` | '/login' | Path to redirect to when authentication is required |
| `authRedirectIfAuthenticated` | '/' | Path to redirect to when user should not be authenticated |
| `enabledAuthProviders` | [] | Array of enabled authentication providers. Available options: AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE, AuthProvider.GITHUB, AuthProvider.TWITTER, AuthProvider.DISCORD |

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
    <div class="container mx-auto p-4">
      <sup-login
        (forgotPassword)="onForgotPassword()"
        (signUp)="onSignUp()"
      ></sup-login>
    </div>
  `
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

### 2. Create Signup Page

```typescript
import { Component } from '@angular/core';
import { SignupComponent } from '@dotted-labs/ngx-supabase-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-signup',
  standalone: true,
  imports: [SignupComponent],
  template: `
    <div class="container mx-auto p-4">
      <sup-signup
        (backToLogin)="onBackToLogin()"
      ></sup-signup>
    </div>
  `
})
export class SignupPageComponent {
  constructor(private router: Router) {}

  onBackToLogin() {
    this.router.navigate(['/login']);
  }
}
```

### 3. Create Password Reset Page

```typescript
import { Component } from '@angular/core';
import { PasswordResetComponent } from '@dotted-labs/ngx-supabase-auth';
import { Router } from '@angular/router';

@Component({
  selector: 'app-password-reset',
  standalone: true,
  imports: [PasswordResetComponent],
  template: `
    <div class="container mx-auto p-4">
      <sup-password-reset
        (backToLogin)="onBackToLogin()"
      ></sup-password-reset>
    </div>
  `
})
export class PasswordResetPageComponent {
  constructor(private router: Router) {}

  onBackToLogin() {
    this.router.navigate(['/login']);
  }
}
```

### 4. Create Profile Page

```typescript
import { Component } from '@angular/core';
import { ProfileComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [ProfileComponent],
  template: `
    <div class="container mx-auto p-4">
      <sup-profile></sup-profile>
    </div>
  `
})
export class ProfilePageComponent {}
```

### 5. Set Up Routes

```typescript
import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page.component';
import { SignupPageComponent } from './pages/signup-page.component';
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
    path: 'signup', 
    component: SignupPageComponent,
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
 
## License

MIT
