# ngx-supabase-auth: Angular Authentication with Supabase

[![npm version](https://badge.fury.io/js/%40dotted-labs%2Fngx-supabase-auth.svg)](https://badge.fury.io/js/%40dotted-labs%2Fngx-supabase-auth)
[![License: MIT](https://img.shields.io/badge/License-MIT-yellow.svg)](https://opensource.org/licenses/MIT)

**Effortlessly integrate Supabase authentication into your Angular applications!**

`ngx-supabase-auth` provides a set of pre-built components, services, and guards to handle common authentication flows like login, signup, password reset, profile management, and route protection, including support for social logins and Electron desktop applications. Built with Angular Signals and NgRx Signals for modern, reactive state management.

**Jumpstart your project with secure authentication in minutes!**

## Features

- **Simple Integration:** Configure Supabase and the library easily in your `app.config.ts`.
- **Pre-built UI Components:** Ready-to-use components for:
  - Login (`<sup-login>`)
  - Signup (`<sup-signup>`)
  - Password Reset (`<sup-password-reset>`)
  - User Profile (`<sup-profile>`)
  - Social Login Buttons (`<sup-social-login>`)
- **Electron/Desktop Support:** Specialized components (`<sup-login-desktop>`, `<sup-login-desktop-redirect>`) for handling authentication flows (especially social logins) in desktop environments.
- **Reactive State Management:** Centralized `AuthStore` powered by `ngrx/signals` provides signals for user, session, profile, authentication status (`isAuthenticated`), and loading states.
- **Route Protection:** Easy-to-use `authGuard` and `unauthGuard` to protect your application routes.
- **Social Logins:** Configure and use various Supabase-supported social OAuth providers.
- **TypeScript & Signals:** Built with strict TypeScript and leverages Angular Signals for optimal performance and developer experience.
- **Tailwind CSS & daisyUI:** Components are styled with Tailwind CSS and daisyUI for easy customization (requires Tailwind setup in your project).

## Installation

```bash
npm install @dotted-labs/ngx-supabase-auth @supabase/supabase-js
```

_Requires `@angular/core`, `@angular/common`, `@angular/router`, `rxjs`, `ngrx/signals`. You also need to have Tailwind CSS and daisyUI configured in your Angular project if you intend to use the default component styling._

## Getting Started

### 1. Configure in `app.config.ts`

Import `provideSupabaseAuth` and add it to the `providers` array in your `ApplicationConfig`.

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideSupabaseAuth } from '@dotted-labs/ngx-supabase-auth';
import { routes } from './app.routes';
import { environment } from '../environments/environment'; // Your environment file

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes), // Your routes
    provideSupabaseAuth({
      supabaseUrl: environment.supabaseUrl, // Your Supabase URL
      supabaseKey: environment.supabaseKey, // Your Supabase Anon Key
      // Optional configuration
      // config: {
      //   redirectUrl: 'http://localhost:4200/callback', // Optional: Override redirect URL
      //   requireMetadataFields: ['full_name'], // Optional: Fields required in user_metadata for profile completion
      //   storageType: 'sessionStorage' // Optional: 'localStorage' (default) or 'sessionStorage'
      // }
    }),
    // ... other providers
  ],
};
```

### 2. Use Components

Import the standalone components into your page components where needed.

```typescript
// Example: src/app/pages/login-page/login-page.component.ts
import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [LoginComponent], // Import the library component
  template: `
    <div class="container mx-auto p-4">
      <h1 class="text-2xl font-bold mb-4">Login</h1>
      <sup-login (forgotPassword)="goToPasswordReset()" (signUp)="goToSignup()" />
      <!-- Optionally add social login -->
      <sup-social-login class="mt-4" />
    </div>
  `,
})
export class LoginPageComponent {
  constructor(private readonly router: Router) {}

  public goToPasswordReset(): void {
    this.router.navigate(['/password-reset']);
  }

  public goToSignup(): void {
    this.router.navigate(['/signup']);
  }
}
```

- Use `<sup-signup>` for the registration page.
- Use `<sup-password-reset>` for the password recovery page.
- Use `<sup-profile>` for the user profile management page.
- Use `<sup-social-login>` to display configured social login buttons.

### 3. Access Authentication State (`AuthStore`)

Inject the `AuthStore` into your components or services to reactively access authentication status, user data, and trigger actions.

```typescript
// Example: src/app/components/navbar/navbar.component.ts
import { Component, computed, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [RouterLink],
  template: `
    <nav class="navbar bg-base-100">
      <div class="flex-1">
        <a class="btn btn-ghost text-xl" routerLink="/">MyApp</a>
      </div>
      <div class="flex-none">
        @if (authStore.isAuthenticated()) {
          <span class="mr-4">Welcome, {{ userName() }}</span>
          <button class="btn btn-ghost" (click)="logout()">Logout</button>
          <a class="btn btn-ghost" routerLink="/profile">Profile</a>
        } @else if (!authStore.isLoading()) {
          <a class="btn btn-ghost" routerLink="/login">Login</a>
          <a class="btn btn-ghost" routerLink="/signup">Sign Up</a>
        } @else {
          <span class="loading loading-spinner"></span>
        }
      </div>
    </nav>
  `,
})
export class NavbarComponent {
  public readonly authStore = inject(AuthStore);

  // Example computed signal
  public userName = computed(() => {
    const profile = this.authStore.profile();
    // Use a specific field from profile or fallback to email
    return profile?.['full_name'] ?? this.authStore.user()?.email ?? 'User';
  });

  public logout(): void {
    this.authStore.signOut(); // Call store action
  }
}
```

Key `AuthStore` Signals:

- `user()`: Current Supabase `User` or `null`.
- `session()`: Current Supabase `Session` or `null`.
- `profile()`: User profile data (from `profiles` table, if configured) or `null`.
- `isAuthenticated()`: `boolean` indicating if the user is logged in.
- `isLoading()`: `boolean` indicating if an auth operation is in progress.
- `authError()`: Any Supabase auth error that occurred.

Key `AuthStore` Methods:

- `signInWithPassword()`, `signUpWithEmail()`, `signOut()`, `resetPasswordForEmail()`, `updatePassword()`, `signInWithOtp()`, `signInWithOAuth()`, `updateUserProfile()` ...and more.

### 4. Protect Routes

Import and use `authGuard` and `unauthGuard` in your route definitions.

```typescript
// src/app/app.routes.ts
import { Routes } from '@angular/router';
import { authGuard, unauthGuard } from '@dotted-labs/ngx-supabase-auth';

export const routes: Routes = [
  {
    path: 'dashboard',
    loadComponent: () => import('./pages/dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard], // Requires user to be authenticated
  },
  {
    path: 'profile',
    loadComponent: () => import('./pages/profile/profile.component').then((m) => m.ProfileComponent),
    canActivate: [authGuard], // Requires user to be authenticated
  },
  {
    path: 'login',
    loadComponent: () => import('./pages/login/login.component').then((m) => m.LoginComponent),
    canActivate: [unauthGuard], // Requires user NOT to be authenticated
  },
  {
    path: 'signup',
    loadComponent: () => import('./pages/signup/signup.component').then((m) => m.SignupComponent),
    canActivate: [unauthGuard], // Requires user NOT to be authenticated
  },
  // ... other routes
];
```

## Components Reference

- **`<sup-login>`:** Standard login form (email/password). Emits `forgotPassword`, `signUp`.
- **`<sup-signup>`:** Standard registration form (email/password, optional metadata). Emits `backToLogin`.
- **`<sup-password-reset>`:** Form for requesting password reset email and setting a new password. Emits `backToLogin`.
- **`<sup-profile>`:** Displays user information (email, metadata) and allows updating profile data and password.
- **`<sup-social-login>`:** Displays buttons for configured social OAuth providers.
- **`<sup-login-desktop>`:** Login component optimized for Electron/desktop flows. Initiates OAuth via system browser.
- **`<sup-login-desktop-redirect>`:** Helper component used in the desktop redirect handler page to process the login callback.

## Electron / Desktop Integration

Handling authentication, especially social logins, in desktop applications requires a specific flow:

1.  Use `<sup-login-desktop>` in your main application window. When a user clicks a social login button, it triggers `signInWithOAuth`, which opens the system browser for authentication.
2.  Configure Supabase OAuth to redirect to a custom URI scheme (e.g., `myapp://auth-callback/`) that your Electron app listens for.
3.  Your Electron main process (`electron/main.ts`) needs to capture this custom URI activation.
4.  The main process typically passes the URL fragment (containing `#access_token=...&refresh_token=...`) to your Angular renderer process.
5.  Create a dedicated route/component in Angular (e.g., `/auth-handler`) to receive this fragment.
6.  Use the `<sup-login-desktop-redirect>` component within this handler component. It automatically extracts the tokens from the route fragment and completes the sign-in process via the `AuthStore`.

- See the `projects/demo-app-electron` for a working example of this flow.
- The `projects/demo-server` provides an _optional_ helper server demonstrating how to generate a `hashed_token` for an existing session, which is another pattern for logging into a desktop app if the user is already authenticated elsewhere (e.g., a companion web app).

## Demo Applications

Explore the demo applications within this repository for practical implementation examples:

- **`projects/demo-app`:** Standard Angular web application demonstrating core features (login, signup, profile, guards). ([See README](projects/demo-app/README.md))
- **`projects/demo-app-electron`:** Angular application packaged with Electron, showcasing the desktop login flow using `<sup-login-desktop>` and the redirect handling mechanism. ([See README](projects/demo-app-electron/README.md))
- **`projects/demo-server`:** An optional Express server demonstrating the magic link `hashed_token` generation pattern for desktop apps. ([See README](projects/demo-server/README.md))

**To run the demos:**

```bash
# Install all dependencies from the root
npm install

# Run the web demo
npm run start:demo-app

# Run the Electron demo
npm run start:demo-app-electron

# Run the optional demo server (requires separate setup, see its README)
# cd projects/demo-server && npm install && npm run dev
```

## Contributing

Contributions are welcome! Please feel free to:

- Report issues or suggest features via the [GitHub Issues](https://github.com/dotted-labs/ngx-supabase-auth/issues).
- Submit pull requests with bug fixes or enhancements. Please follow the existing code style and ensure tests pass.

## License

This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.
