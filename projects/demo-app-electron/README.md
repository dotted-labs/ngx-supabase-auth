# ngx-supabase-auth Electron Demo Application

This demo application showcases how to use the `@dotted-labs/ngx-supabase-auth` library within an Angular Electron project. It specifically demonstrates handling authentication flows, including social logins, within a desktop application context.

## Features Demonstrated

This Electron demo application utilizes the `ngx-supabase-auth` library to implement:

- **Desktop Login:** Uses the `<sup-login-desktop>` component tailored for initiating authentication flows (especially social logins) in an Electron environment.
- **Authentication Handler:** Implements a mechanism (`auth-handler`) to capture the authentication token after a successful social login redirect, which typically happens outside the main application window in Electron.
- **Redirect Component:** Uses the `<sup-login-desktop-redirect>` component to facilitate the post-login redirect process within the Electron app.
- **State Management:** Leverages the `AuthStore` (`ngrx/signals` based) to manage authentication state, user information, and session status reactively within the Electron application.
- **Route Protection:** Implements `authGuard` to protect the main dashboard route.
- **Configuration:** Shows how to configure the library using `provideSupabaseAuth` in `app.config.ts`.
- **Basic Dashboard:** Includes a simple protected dashboard view accessible after successful login.

## Project Structure

The Electron demo application is structured to handle the nuances of desktop authentication:

```
/demo-app-electron
  /electron                - Contains Electron-specific main process code (e.g., main.ts, preload.ts).
    main.ts                - Electron main process entry point. Configures the browser window and IPC communication.
    preload.ts             - Electron preload script for bridging the main and renderer processes securely.
  /public                  - Static assets.
  /src                     - Angular application source code (Renderer process).
    /app
      /auth-handler        - Component/logic responsible for handling the redirect after social login and extracting the token.
      /dashboard           - Protected main application area shown after login.
      app.component.ts     - Root Angular component.
      app.config.ts        - Angular application configuration.
                             - **Initializes the library via `provideSupabaseAuth`**.
      app.routes.ts        - Defines Angular application routes.
                             - **Uses `authGuard` to protect the dashboard**.
                             - Includes routes for the main login view and the auth handler.
    /environments          - Environment-specific configurations (Supabase URL/Key).
    main.ts                - Angular application entry point (Renderer process).
    index.html             - Main HTML file for the Angular app.
    styles.css             - Global styles (Tailwind CSS / daisyUI).
  tsconfig.app.json        - TypeScript config for the Angular app.
  tsconfig.spec.json       - TypeScript config for tests.
```

## How to Run

To run this Electron demo application:

1.  Make sure you have Node.js and npm installed.
2.  Configure your Supabase credentials in `src/environments/environment.ts` (and `environment.development.ts`). Ensure `supabaseUrl` and `supabaseKey` are set.
3.  **Important:** Configure the redirect handling in `electron/main.ts`. You might need to adjust how the deep-linking/protocol handling is set up based on your OS and requirements to capture the redirect URL containing the auth token. The default setup might need modification for specific social providers or OS versions.
4.  Run the following commands from the root `ngx-supabase-auth` directory:

```bash
# Install dependencies
npm install

# Run the Electron demo application
npm run start:demo-app-electron
```

5.  The Electron application window should launch.

## Library Integration Points

Key integrations with `ngx-supabase-auth` in the Electron context:

### 1. Configuration (`app.config.ts`)

Similar to the web demo, the library is initialized in `app.config.ts` using `provideSupabaseAuth`, providing the Supabase URL and Key.

```typescript
// src/app/app.config.ts (snippet)
import { provideSupabaseAuth } from '@dotted-labs/ngx-supabase-auth';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers
    provideSupabaseAuth({
      supabaseUrl: environment.supabaseUrl,
      supabaseKey: environment.supabaseKey,
      // No specific desktop config needed here usually
    }),
  ],
};
```

### 2. Desktop Login Component (`app.component.ts`)

The root `AppComponent` often hosts the `<sup-login-desktop>` component. This component handles presenting login options (email/password, social providers) suitable for a desktop flow. Clicking a social provider button typically opens the system's default browser for authentication.

```typescript
// Example: src/app/app.component.ts (template snippet)
import { LoginDesktopComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [/*...,*/ LoginDesktopComponent],
  template: `
    @if (authStore.isLoading()) {
      <p>Loading...</p>
    } @else if (!authStore.isAuthenticated()) {
      <sup-login-desktop /> // Use the desktop login component
    } @else {
      <router-outlet /> // Show dashboard or other authenticated content
    }
  `,
})
export class AppComponent {
  public readonly authStore = inject(AuthStore);
  // ...
}
```

### 3. Authentication Handler (`auth-handler/auth-handler.component.ts`)

After a successful social login in the external browser, Supabase redirects back to a custom URI scheme or deep link configured for the Electron app (e.g., `myapp://auth-callback#access_token=...`).

- **Electron Main Process (`electron/main.ts`):** Needs to capture this deep link activation. It typically focuses the app window and might send the URL fragment (containing the token) to the renderer process (Angular app) via IPC.
- **Angular Router (`app.routes.ts`):** A route (e.g., `/auth-handler`) is set up to load the `AuthHandlerComponent`.
- **`AuthHandlerComponent`:** This component receives the URL fragment (often via `ActivatedRoute`). It then uses the `<sup-login-desktop-redirect>` component or directly calls `authStore.handleRedirect()` method from the `AuthStore` to process the token fragment and complete the sign-in process within the Angular application.

```typescript
// Example: src/app/auth-handler/auth-handler.component.ts (snippet)
import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { AuthStore, LoginDesktopRedirectComponent } from '@dotted-labs/ngx-supabase-auth'; // Import redirect component and store

@Component({
  selector: 'app-auth-handler',
  standalone: true,
  imports: [LoginDesktopRedirectComponent], // Use the redirect component
  template: `<sup-login-desktop-redirect />`, // The component handles the logic
})
export class AuthHandlerComponent implements OnInit {
  // Alternatively, handle manually without the component:
  /*
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  async ngOnInit() {
    // IMPORTANT: Logic to get the fragment might differ based on
    // how electron/main.ts passes the data (e.g., IPC, route fragment)
    const fragment = this.route.snapshot.fragment;
    if (fragment) {
      await this.authStore.handleRedirect(`#${fragment}`);
      // Redirect to dashboard or desired route after handling
      this.router.navigate(['/dashboard']);
    } else {
      // Handle error: No fragment found
      this.router.navigate(['/']); // Go back to login
    }
  }
  */
}
```

### 4. State Management (`AuthStore`)

The `AuthStore` is used identically to the web demo for checking `isAuthenticated()`, accessing `user()`, and calling methods like `signOut()`.

### 5. Route Guards (`app.routes.ts`)

The `authGuard` protects routes like `/dashboard`, ensuring only authenticated users can access them.

```typescript
// src/app/app.routes.ts (snippet)
import { Routes } from '@angular/router';
import { authGuard } from '@dotted-labs/ngx-supabase-auth';

export const routes: Routes = [
  // ... route for '/' possibly showing AppComponent with login
  {
    path: 'auth-handler', // Route for the redirect handler
    loadComponent: () => import('./auth-handler/auth-handler.component').then((m) => m.AuthHandlerComponent),
  },
  {
    path: 'dashboard',
    loadComponent: () => import('./dashboard/dashboard.component').then((m) => m.DashboardComponent),
    canActivate: [authGuard], // Protect the dashboard
  },
  // ... other routes
];
```

## Customization

- **Electron Main Process:** Significant customization might be needed in `electron/main.ts` and potentially `electron/preload.ts` to correctly handle deep linking/protocol registration and secure IPC communication for the auth callback URL, depending on the target OS and specific social providers.
- **Styling:** Customize using Tailwind/daisyUI as in the web demo.
- **Logic:** Add features within the Angular part of the application as needed.

## Notes

- Handling redirects securely and reliably is the most complex part of Electron authentication. Ensure the deep link/protocol handling in `electron/main.ts` is robust.
- Test social login flows thoroughly, as provider requirements and OS behaviors can vary.
- Consider security implications of passing tokens between the main and renderer processes (use context isolation and secure IPC channels).
