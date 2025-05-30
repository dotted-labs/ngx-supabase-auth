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

**⚠️ Important:** You **must** provide a Supabase client instance to avoid conflicts. Import `provideSupabaseAuth` and add it to the `providers` array in your `ApplicationConfig`.

```typescript
// src/app/app.config.ts
import { ApplicationConfig } from '@angular/core';
import { provideRouter } from '@angular/router';
import { createClient, SupabaseClient } from '@supabase/supabase-js';
import { provideSupabaseAuth, AuthProvider } from '@dotted-labs/ngx-supabase-auth';
import { routes } from './app.routes';
import { environment } from '../environments/environment';

/**
 * Creates and configures the Supabase client instance in your main application
 * This ensures a single client instance is used throughout the application
 */
function createSupabaseClient(): SupabaseClient {
  return createClient(environment.supabaseUrl, environment.supabaseKey);
}

// Create the single Supabase client instance for the entire app
const supabaseClient = createSupabaseClient();

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideSupabaseAuth({
      supabaseClient: supabaseClient, // Required: Pass the client instance
      // Optional configuration:
      redirectAfterLogin: '/dashboard',
      redirectAfterLogout: '/login',
      authRequiredRedirect: '/login',
      enabledAuthProviders: [AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE],
      // ... other options
    }),
    // ... other providers
  ],
};

// Export the client for use elsewhere in your app
export { supabaseClient };
```

### Advanced Configuration Options

**Why is `supabaseClient` required?**

- Prevents authentication state conflicts
- Ensures consistent session management
- Avoids duplicate auth listeners
- Allows you to use the same client for database, storage, etc.

**Available configuration options:**

```typescript
provideSupabaseAuth({
  supabaseClient: supabaseClient, // Required
  redirectAfterLogin: '/dashboard', // Default: '/'
  redirectAfterLogout: '/login', // Default: '/login'
  authRequiredRedirect: '/login', // Default: '/login'
  enabledAuthProviders: [AuthProvider.EMAIL_PASSWORD, AuthProvider.GOOGLE],
  firstTimeProfileRedirect: '/complete-profile', // For first-time users
  electronDeepLinkProtocol: 'myapp://auth', // For Electron apps
  // ... other options
});
```

**Using the same client elsewhere in your app:**

```typescript
// src/app/services/database.service.ts
import { Injectable } from '@angular/core';
import { supabaseClient } from '../app.config';

@Injectable({ providedIn: 'root' })
export class DatabaseService {
  async getTodos() {
    const { data, error } = await supabaseClient.from('todos').select('*');
    return { data, error };
  }
}
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
    const user = this.authStore.user();
    // Use user metadata or fallback to email
    return user?.user_metadata?.['name'] ?? user?.email?.split('@')[0] ?? 'User';
  });

  public logout(): void {
    this.authStore.signOut(); // Call store action
  }
}
```

Key `AuthStore` Signals:

- `user()`: Current Supabase `User` or `null`.
- `isAuthenticated()`: `boolean` indicating if the user is logged in.
- `loading()`: `boolean` indicating if an auth operation is in progress.
- `error()`: Any authentication error that occurred, or `null`.
- `name()`: User's display name from metadata.
- `avatarUrl()`: User's avatar URL or default avatar.
- `enabledAuthProviders()`: Array of enabled authentication providers.

Key `AuthStore` Methods:

- `signInWithEmail()`, `signUpWithEmail()`, `signOut()`, `sendPasswordResetEmail()`, `updatePassword()`, `signInWithSocialProvider()`, `updateProfile()` ...and more.

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

1.  Use `<sup-login-desktop>` in your main application window. When a user clicks a social login button, it triggers `signInWithSocialProvider`, which opens the system browser for authentication.
2.  Configure Supabase OAuth to redirect to a custom URI scheme (e.g., `myapp://auth-callback/`) that your Electron app listens for.
3.  Your Electron main process (e.g., `electron/main.ts` or `electron/main.js`) needs to capture this custom URI activation.

    Here's a very concise example focusing on the core logic for deep link handling in Electron's main process:

    ```javascript
    // main.js (Electron Main Process) - Highly Simplified Example
    const { app, BrowserWindow } = require('electron'); // BrowserWindow may be needed to find mainWindow
    let mainWindow; // Assume mainWindow is your main application window, managed elsewhere
    const PROTOCOL_PREFIX = 'myapp://'; // Your custom protocol
    const DEEP_LINK_CHANNEL = 'ngx-supabase-auth:deep-link-received'; // IPC Channel

    function sendUrlToRenderer(url) {
      if (mainWindow && mainWindow.webContents && url && url.startsWith(PROTOCOL_PREFIX)) {
        console.log(`Forwarding URL to renderer on channel ${DEEP_LINK_CHANNEL}: ${url}`);
        mainWindow.webContents.send(DEEP_LINK_CHANNEL, url);
        if (mainWindow.isMinimized()) mainWindow.restore();
        mainWindow.focus();
      } else {
        console.log('Main window not ready or invalid URL for deep linking.');
        // Optionally, store the URL to be processed when the window is ready
      }
    }

    // macOS: Handle when app is launched or re-opened via URL
    app.on('open-url', (event, url) => {
      event.preventDefault();
      sendUrlToRenderer(url);
    });

    // Windows/Linux: Handle when app is launched via URL (first instance)
    // or when a second instance is attempted with a URL.
    const primaryInstance = app.requestSingleInstanceLock();

    if (!primaryInstance) {
      app.quit();
    } else {
      app.on('second-instance', (event, commandLine) => {
        const urlFromArgs = commandLine.find((arg) => arg.startsWith(PROTOCOL_PREFIX));
        if (urlFromArgs) sendUrlToRenderer(urlFromArgs);
      });

      // Check if the app was launched by a URL (primary instance)
      const initialUrlFromCmd = process.argv.find((arg) => arg.startsWith(PROTOCOL_PREFIX));
      if (initialUrlFromCmd) {
        // If app is not ready yet, you might need to store this URL and process it
        // once the mainWindow is created and its webContents are loaded.
        // For this concise example, we'll attempt to send if app becomes ready soon.
        app.whenReady().then(() => {
          sendUrlToRenderer(initialUrlFromCmd);
        });
      }
    }

    // mainWindow creation and other app event listeners (like 'ready') are assumed
    // to be handled elsewhere in your main process file.
    ```

    **Important: Bridging with a Preload Script**

    For the renderer process (your Angular app) to receive the `deep-link-received` event securely, especially with `contextIsolation` enabled (default and recommended), you need a `preload.js` script associated with your `BrowserWindow`. This script runs in a privileged environment and can expose specific Node.js/Electron functionalities to your renderer via `contextBridge`.

    Here's an example of what you might include in your `preload.js`:

    ```javascript
    // preload.js
    const { contextBridge, ipcRenderer } = require('electron');

    contextBridge.exposeInMainWorld('ngxSupabaseAuth', {
      // Expose a function to the renderer to listen for deep link URLs
      onDeepLinkReceived: (callback) => {
        // Remove any existing listener for this channel to prevent duplicates if this is called multiple times
        ipcRenderer.removeAllListeners('ngx-supabase-auth:deep-link-received');
        // Listen for the specific channel from the main process
        ipcRenderer.on('ngx-supabase-auth:deep-link-received', (event, url) => callback(url));
      },
    });
    ```

    Ensure your `BrowserWindow` is configured to use this preload script:

    ```javascript
    // In your main.js where mainWindow is created
    // const mainWindow = new BrowserWindow({
    //   webPreferences: {
    //     preload: path.join(__dirname, 'preload.js'), // Path to your preload script
    //     contextIsolation: true, // Recommended for security
    //     nodeIntegration: false, // Recommended for security
    //   }
    // });
    ```

    Then, in your Angular component that handles the redirect (e.g., the one using `<sup-login-desktop-redirect>`), you would use this exposed API:

    ```typescript
    // Example in your Angular component (e.g., auth-handler.component.ts)
    // declare global {
    //   interface Window {
    //     ngxSupabaseAuth: {
    //       onDeepLinkReceived: (callback: (url: string) => void) => void;
    //     };
    //   }
    // }
    //
    // ngOnInit() {
    //   if (window.ngxSupabaseAuth) {
    //     window.ngxSupabaseAuth.onDeepLinkReceived((url: string) => {
    //       console.log('Deep link URL received in renderer:', url);
    //       // Here, you would typically pass the URL to your AuthStore
    //       // or the <sup-login-desktop-redirect> component logic if it handles it directly.
    //       // For example, by navigating to a route that includes the URL fragment/query.
    //       // this.router.navigate(['/auth-handler'], { queryParams: { fromElectronUrl: url } });
    //     });
    //   } else {
    //       console.warn('ngxSupabaseAuth API not found on window. Ensure preload script is working.');
    //   }
    // }
    ```

4.  The Electron main process captures the full deep link URL (e.g., `myapp://auth-callback/#access_token=...&refresh_token=...` or `myapp://auth-callback/?hashed_token=...`) and passes it to your Angular renderer process using the mechanism described above. This handoff is crucial for completing the authentication flow within the Angular application.

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
