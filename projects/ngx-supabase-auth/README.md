# ngx-supabase-auth

An Angular library for handling authentication with Supabase. This library provides ready-to-use components, services and guards for implementing authentication in Angular applications using Supabase as the backend.

## Features

- 🔑 Authentication components (Login, Password Reset, Profile)
- 🔒 Authentication guards for route protection
- 📊 State management using ngrx/signals
- 🌈 Social login support (Google, Facebook, Twitter, GitHub, Discord)
- 📱 Responsive design with Tailwind CSS
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
      // Optional configuration
      redirectAfterLogin: '/dashboard',
      redirectAfterLogout: '/login',
      authRequiredRedirect: '/login',
      authRedirectIfAuthenticated: '/dashboard'
    })
  ]
};
```

## Components

### LoginComponent

The login component handles user authentication via email/password or social providers.

#### Import

```typescript
import { LoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  // ...
  imports: [LoginComponent],
  // ...
})
```

#### Usage

```html
<sup-login
  title="Welcome Back"
  subtitle="Log in to your account"
  [showSocialLogins]="true"
  [enabledSocialProviders]="[SocialAuthProvider.GOOGLE, SocialAuthProvider.FACEBOOK, SocialAuthProvider.GITHUB]"
  [showForgotPassword]="true"
  [showSignUpLink]="true"
  (forgotPassword)="onForgotPassword()"
  (signUp)="onSignUp()"
></sup-login>
```

#### Parameters

| Input | Type | Default | Required | Description |
|-------|------|---------|----------|-------------|
| title | string | 'Login' | No | Title displayed at the top of the login form |
| subtitle | string | undefined | No | Optional subtitle displayed below the title |
| showSocialLogins | boolean | true | No | Whether to show social login options |
| enabledSocialProviders | SocialAuthProvider[] | All providers | No | Array of social providers to enable (Google, Facebook, Twitter, GitHub, Discord) |
| showForgotPassword | boolean | true | No | Whether to show the forgot password link |
| showSignUpLink | boolean | true | No | Whether to show the sign up link |

| Output | Type | Description |
|--------|------|-------------|
| forgotPassword | EventEmitter<void> | Emitted when the user clicks the forgot password link |
| signUp | EventEmitter<void> | Emitted when the user clicks the sign up link |

### ProfileComponent

The profile component allows users to manage their profile information and change their password.

#### Import

```typescript
import { ProfileComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  // ...
  imports: [ProfileComponent],
  // ...
})
```

#### Usage

```html
<sup-profile
  title="User Profile"
  subtitle="Manage your account information"
  [showAvatarSection]="true"
  [showPasswordSection]="true"
  [showSignOut]="true"
  [allowEmailChange]="false"
></sup-profile>
```

#### Parameters

| Input | Type | Default | Required | Description |
|-------|------|---------|----------|-------------|
| title | string | 'User Profile' | No | Title displayed at the top of the profile form |
| subtitle | string | undefined | No | Optional subtitle displayed below the title |
| showAvatarSection | boolean | true | No | Whether to show the avatar section |
| showPasswordSection | boolean | true | No | Whether to show the password change section |
| showSignOut | boolean | true | No | Whether to show the sign out button |
| allowEmailChange | boolean | false | No | Whether to allow the user to change their email |

### PasswordResetComponent

The password reset component allows users to request a password reset link.

#### Import

```typescript
import { PasswordResetComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  // ...
  imports: [PasswordResetComponent],
  // ...
})
```

#### Usage

```html
<sup-password-reset
  title="Reset Password"
  subtitle="Enter your email to get a reset link"
  (backToLogin)="onBackToLogin()"
></sup-password-reset>
```

#### Parameters

| Input | Type | Default | Required | Description |
|-------|------|---------|----------|-------------|
| title | string | 'Reset Password' | No | Title displayed at the top of the password reset form |
| subtitle | string | undefined | No | Optional subtitle displayed below the title. If not provided, a default message will be shown. |

| Output | Type | Description |
|--------|------|-------------|
| backToLogin | EventEmitter<void> | Emitted when the user clicks the back to login link |

## Authentication Store

The library uses a state management system based on Angular's signals to manage authentication state.

### Using the AuthStore

You can inject and use the AuthStore directly in your components:

```typescript
import { Component, inject } from '@angular/core';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-my-component',
  template: `
    <div *ngIf="authStore.user()">
      <p>Welcome, {{ authStore.user()?.email }}</p>
    </div>
  `
})
export class MyComponent {
  authStore = inject(AuthStore);
}
```

### AuthStore API

#### Properties (Signals)

| Property | Type | Description |
|----------|------|-------------|
| user | Signal<User \| null> | Current authenticated user |
| loading | Signal<boolean> | Whether an authentication action is in progress |
| error | Signal<string \| null> | Current authentication error message, if any |
| isAuthenticated | Signal<boolean> | Whether the user is authenticated |

#### Methods

| Method | Parameters | Return Type | Description |
|--------|------------|-------------|-------------|
| signInWithEmail | email: string, password: string | Promise<void> | Sign in with email and password |
| signInWithSocialProvider | provider: SocialAuthProvider | Promise<void> | Sign in with a social provider |
| signOut | - | Promise<void> | Sign out the current user |
| resetPassword | email: string | Promise<void> | Request a password reset email |
| updateProfile | data: UserProfileUpdate | Promise<void> | Update user profile data |
| updatePassword | password: string | Promise<void> | Update user's password |

### Extending the AuthStore

You can extend the AuthStore by creating your own store that inherits from it:

```typescript
import { Injectable, inject } from '@angular/core';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';
import { computed } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MyExtendedAuthStore extends AuthStore {
  // Add your own properties and methods
  
  // Example: computed signal for user's display name
  readonly displayName = computed(() => {
    const user = this.user();
    return user?.user_metadata?.full_name || user?.email || 'User';
  });
  
  // Example: custom method
  async signInAndLoadUserData(email: string, password: string) {
    await this.signInWithEmail(email, password);
    if (this.isAuthenticated()) {
      // Load additional user data
      await this.loadUserData();
    }
  }
  
  private async loadUserData() {
    // Your custom implementation
  }
}
```

Then use your extended store instead of the original:

```typescript
import { Component, inject } from '@angular/core';
import { MyExtendedAuthStore } from './my-extended-auth.store';

@Component({
  selector: 'app-my-component',
  template: `
    <div *ngIf="authStore.isAuthenticated()">
      <p>Welcome, {{ authStore.displayName() }}</p>
    </div>
  `
})
export class MyComponent {
  authStore = inject(MyExtendedAuthStore);
}
```

## Guards

Los guards permiten proteger rutas basándose en el estado de autenticación del usuario.

### Auth Guard

Protects routes that require authentication:

```typescript
import { Routes } from '@angular/router';
import { authGuard } from '@dotted-labs/ngx-supabase-auth';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard],
    // Optional: custom redirect path using data property
    data: {
      authRequiredRedirect: '/custom-login-page'
    }
  }
];
```

The `authGuard` can be configured with the following options through the `data` property:

| Property | Type | Description |
|----------|------|-------------|
| authRequiredRedirect | string | Custom URL where users will be redirected if not authenticated. Overrides the global config. |

### Unauth Guard

Prevents authenticated users from accessing certain routes:

```typescript
import { Routes } from '@angular/router';
import { unauthGuard } from '@dotted-labs/ngx-supabase-auth';

export const routes: Routes = [
  {
    path: 'login',
    component: LoginPageComponent,
    canActivate: [unauthGuard],
    // Optional: custom redirect path using data property
    data: {
      authRedirectIfAuthenticated: '/custom-dashboard'
    }
  }
];
```

The `unauthGuard` can be configured with the following options through the `data` property:

| Property | Type | Description |
|----------|------|-------------|
| authRedirectIfAuthenticated | string | Custom URL where authenticated users will be redirected. Overrides the global config. |

## Complete Example

Here's a complete example showcasing all components together:

```typescript
// app.routes.ts
import { Routes } from '@angular/router';
import { LoginPageComponent } from './pages/login-page.component';
import { PasswordResetPageComponent } from './pages/password-reset-page.component';
import { ProfilePageComponent } from './pages/profile-page.component';
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
  { path: '', redirectTo: '/login', pathMatch: 'full' }
];

// login-page.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <sup-login
        title="Welcome Back"
        subtitle="Log in to your account"
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
    // Navigate to sign up page or open a signup dialog
    console.log('Sign up clicked');
  }
}

// password-reset-page.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PasswordResetComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-password-reset-page',
  standalone: true,
  imports: [PasswordResetComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
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

// profile-page.component.ts
import { Component } from '@angular/core';
import { ProfileComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-profile-page',
  standalone: true,
  imports: [ProfileComponent],
  template: `
    <div class="max-w-7xl mx-auto px-4 py-8">
      <sup-profile
        title="Your Profile"
        subtitle="Manage your account information"
      ></sup-profile>
    </div>
  `
})
export class ProfilePageComponent {}
```

## License

MIT
