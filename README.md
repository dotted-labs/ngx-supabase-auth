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
- 🖥️ Electron support for desktop applications

## Installation

```bash
npm install @dotted-labs/ngx-supabase-auth
```

## Setup

First, configure the library in your `app.config.ts`:

### Web Application Configuration

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
      enabledAuthProviders: ['email_password', 'google', 'github'],
    }),
  ],
};
```

### Electron Application Configuration

For Electron applications, additional configuration is needed to handle the authentication flow between the desktop app and web browser:

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
      enabledAuthProviders: ['email_password', 'google', 'github'],

      // Enable Electron mode
      isElectronMode: true,

      // URL of your web app for handling authentication
      webAppAuthUrl: 'https://your-web-app.com/auth',

      // Deep link protocol for your Electron app
      electronDeepLinkProtocol: 'your-app://auth',
    }),
  ],
};
```

## Configuration Options

The following table describes all available options for the `provideSupabaseAuth` function:

| Option                        | Default Value | Description                                                                                                                                                                     |
| ----------------------------- | ------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `supabaseUrl`                 | -             | Your Supabase project URL                                                                                                                                                       |
| `supabaseKey`                 | -             | Your Supabase API key                                                                                                                                                           |
| `redirectAfterLogin`          | '/'           | Path to redirect to after successful login                                                                                                                                      |
| `redirectAfterLogout`         | '/login'      | Path to redirect to after logout                                                                                                                                                |
| `authRequiredRedirect`        | '/login'      | Path to redirect to when authentication is required                                                                                                                             |
| `authRedirectIfAuthenticated` | '/'           | Path to redirect to when user should not be authenticated                                                                                                                       |
| `enabledAuthProviders`        | []            | Array of enabled authentication providers. Available options: AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE, AuthProvider.GITHUB, AuthProvider.TWITTER, AuthProvider.DISCORD |
| `isElectronMode`              | false         | Enable Electron mode                                                                                                                                                            |
| `webAppAuthUrl`               | -             | URL of your web app for handling authentication                                                                                                                                 |
| `electronDeepLinkProtocol`    | -             | Deep link protocol for your Electron app                                                                                                                                        |
| `magicLinkGeneratorUrl`       | -             | URL to generate magic link tokens for Electron auth flow (requires a secure endpoint with Supabase service role)                                                                |

## Quick Start

The way to use the component correctly is to create components for each of the pages to be used in the project as a wrapper of the components of the package such as sup-login, sup-signup, sup-password-reset, sup-profile

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
      <sup-login (forgotPassword)="onForgotPassword()" (signUp)="onSignUp()"></sup-login>
    </div>
  `,
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
      <sup-signup (backToLogin)="onBackToLogin()"></sup-signup>
    </div>
  `,
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
      <sup-password-reset (backToLogin)="onBackToLogin()"></sup-password-reset>
    </div>
  `,
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
  `,
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
    canActivate: [unauthGuard],
  },
  {
    path: 'signup',
    component: SignupPageComponent,
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
  { path: '', redirectTo: '/login', pathMatch: 'full' },
];
```

## Electron Integration

This library supports authentication in Electron applications by using a secure flow where:

1. The Electron app opens the user's default web browser to authenticate
2. After successful authentication, the web app redirects back to the Electron app via a deep link
3. The Electron app verifies the token and creates a separate, valid session

### Web Application Setup (Server-side)

On your web application, you need to handle Electron authentication requests and generate magic link tokens. Here's an example server-side implementation:

```typescript
// This would be your server-side authentication controller
import { createClient } from '@supabase/supabase-js';

// Create admin client with service role key (keep this secure!)
const supabaseAdmin = createClient(process.env.SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY);

// Handle auth success and redirect back to Electron app
async function handleElectronAuth(userId) {
  // Get user email from the authenticated session
  const { data, error } = await supabaseAdmin.auth.getUser(userId);

  if (error || !data.user) {
    return { error: 'User not found' };
  }

  const email = data.user.email;

  // Generate magic link for the user
  const { data: magicLink, error: magicLinkErr } = await supabaseAdmin.auth.admin.generateLink({
    type: 'magiclink',
    email,
  });

  if (magicLinkErr) {
    return { error: magicLinkErr.message };
  }

  // Extract hashed token from magic link
  const hashedToken = magicLink.properties?.hashed_token;

  // Redirect to Electron app with the hashed token
  // The protocol (your-app://) should match electronDeepLinkProtocol in your config
  return {
    redirectUrl: `your-app://auth?hashed_token=${hashedToken}`,
  };
}
```

### Electron Application Setup

In your Electron application, you need to:

1. Register your custom protocol (deep link handler)
2. Handle incoming deep links and extract authentication tokens

```typescript
// In your Electron main process
import { app, BrowserWindow } from 'electron';
import { protocol } from 'electron';

// Register protocol
app.whenReady().then(() => {
  // Register your deep link protocol
  protocol.registerFileProtocol('your-app', (request, callback) => {
    // The URL is in request.url
    const url = request.url;

    // Forward to your renderer process
    mainWindow.webContents.send('deep-link-received', url);
  });
});

// Also handle when app is opened with URL (macOS)
app.on('open-url', (event, url) => {
  event.preventDefault();
  mainWindow.webContents.send('deep-link-received', url);
});
```

### Angular Component in Electron App

Here's how to handle the deep link in your Angular component:

```typescript
import { Component, OnInit, inject } from '@angular/core';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-auth-handler',
  template: `
    <div class="auth-handler">
      <div *ngIf="store.loading()">Verifying authentication...</div>
      <div *ngIf="store.error()">{{ store.error() }}</div>
      <div *ngIf="store.user()">Authentication successful!</div>
    </div>
  `,
})
export class AuthHandlerComponent implements OnInit {
  public readonly store = inject(AuthStore);

  ngOnInit() {
    // Listen for deep link events from Electron main process
    window.electron.receive('deep-link-received', (url: string) => {
      this.handleDeepLink(url);
    });
  }

  async handleDeepLink(url: string) {
    // Process the deep link and authenticate
    await this.store.processDeepLinkAuth(url);

    // If authentication was successful, navigate to dashboard
    if (this.store.user()) {
      // Navigate to dashboard or other protected route
    }
  }

  // Initiate authentication in browser
  login() {
    // This opens the web browser
    this.store.openExternalAuthWindow('login');
  }

  signup() {
    // This opens the web browser
    this.store.openExternalAuthWindow('signup');
  }
}
```

## Contributing

## Automatic Release Process

The library uses GitHub Actions to automate the release and publishing process. When you push changes to the `main` branch that include a version update in the `projects/ngx-supabase-auth/package.json` file, the following will happen automatically:

1. A new GitHub release will be created with the new version number
2. The library will be built and published to npm

### How to create a new release

1. Update the version in `projects/ngx-supabase-auth/package.json`
2. Commit and push to main:
   ```bash
   git add projects/ngx-supabase-auth/package.json
   git commit -m "chore: bump version to x.x.x"
   git push origin main
   ```
3. The GitHub Actions workflow will automatically:
   - Detect the version change
   - Create a GitHub release
   - Publish the package to npm

> **Note:** You need to have an NPM_TOKEN secret configured in your GitHub repository settings for the automatic npm publishing to work.

## License

MIT

## Environment Configuration and Credentials

The project uses a special approach to handle environment variables that keeps sensitive credentials like Supabase URL and keys private while allowing the environment files to remain in version control:

### How it works

1. Default environments (`environment.ts` and `environment.prod.ts`) contain placeholder values
2. Local environment files (`environment.local.ts`) contain your real credentials and are excluded from git
3. The application merges these configurations, with local values taking precedence

### Setting up local environments

1. Copy the example file to create your local environment:

   ```bash
   cp projects/demo-app/src/environments/environment.local.example.ts projects/demo-app/src/environments/environment.local.ts
   cp projects/demo-app-electron/src/environments/environment.local.example.ts projects/demo-app-electron/src/environments/environment.local.ts
   ```

2. Edit the local files and add your real Supabase credentials
3. Run the application which will use your local credentials

Note: `environment.local.ts` files are excluded from git via .gitignore to prevent accidental sharing of sensitive information.
