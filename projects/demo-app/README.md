# ngx-supabase-auth Demo Application

This demo application showcases the functionalities of the `@dotted-labs/ngx-supabase-auth` library within an Angular project. It serves as a practical example of how to integrate the library's components, services, and features for building authentication flows.

## Features Demonstrated

This demo application utilizes the `ngx-supabase-auth` library to implement:

- **Login:** Uses the `<sup-login>` component for user authentication via email/password and social providers.
- **Signup:** Employs the `<sup-signup>` component for new user registration.
- **Password Reset:** Integrates the `<sup-password-reset>` component for password recovery functionality.
- **Profile Management:** Leverages the `<sup-profile>` component to allow users to view and update their profile information.
- **Social Login:** Shows how to configure and use social login providers like Google through the library's components.
- **State Management:** Utilizes the `AuthStore` provided by the library (`ngrx/signals` based) to manage authentication state, user information, and session status reactively.
- **Route Protection:** Implements `authGuard` and `unauthGuard` from the library to protect routes based on authentication status.
- **Configuration:** Demonstrates how to configure the library with Supabase credentials and settings in `app.config.ts` using `provideSupabaseAuth`.
- **Desktop Login Flow:** Includes examples for handling desktop-specific authentication flows (`<sup-login-desktop>`, `<sup-login-desktop-redirect>`).

## Project Structure

The demo application is structured to clearly separate concerns and demonstrate the integration points with the `ngx-supabase-auth` library:

```
/demo-app
  /src
    /app
      /pages                     - Contains container components for different application views.
        /complete-profile        - Page for completing user profile after signup (if required).
        /dashboard               - Protected main application area accessible after login.
        /login                   - Page hosting the <sup-login> component.
        /login-desktop           - Page demonstrating the desktop login flow components.
        /password-reset          - Page hosting the <sup-password-reset> component.
        /profile                 - Page hosting the <sup-profile> component.
        /signup                  - Page hosting the <sup-signup> component.
      app.component.ts           - Root application component, often used for global layout or initialization.
      app.config.ts              - Application configuration file.
                                   - **Crucially, this is where `provideSupabaseAuth` from `@dotted-labs/ngx-supabase-auth` is called** to initialize the library with Supabase credentials and optional configuration (e.g., required metadata).
      app.routes.ts              - Defines application routes.
                                   - **Uses `authGuard` and `unauthGuard` from the library** to control access to specific routes based on authentication state.
    /environments              - Environment-specific configurations (e.g., Supabase URL and Key).
    main.ts                    - Main entry point for the Angular application.
    index.html                 - Main HTML file.
    styles.css                 - Global styles (integrates Tailwind CSS and daisyUI).

```

## How to Run

To run this demo application:

1.  Make sure you have Node.js and npm installed.
2.  Configure your Supabase credentials in `src/environments/environment.ts` (and `environment.development.ts` if needed). The necessary properties are `supabaseUrl` and `supabaseKey`.
3.  Run the following commands from the root `ngx-supabase-auth` directory:

```bash
# Install dependencies
npm install

# Run the demo application
npm run start:demo-app
```

4.  Open your browser at `http://localhost:4200`.

## Library Integration Points

Here's how the demo app integrates specific features from the `ngx-supabase-auth` library:

### 1. Configuration (`app.config.ts`)

The library is initialized within the `providers` array in `app.config.ts`. The `provideSupabaseAuth` function is imported and called, passing an object containing the Supabase URL and Key (typically sourced from environment files) and any optional configuration.

```typescript
// src/app/app.config.ts (snippet)
import { provideSupabaseAuth } from '@dotted-labs/ngx-supabase-auth';
import { environment } from '../environments/environment';

export const appConfig: ApplicationConfig = {
  providers: [
    // ... other providers like provideRouter
    provideSupabaseAuth({
      supabaseUrl: environment.supabaseUrl,
      supabaseKey: environment.supabaseKey,
      // config: { /* Optional config */ }
    }),
  ],
};
```

### 2. Components (within `/pages`)

The demo application hosts the library's UI components (e.g., `<sup-login>`, `<sup-signup>`, `<sup-profile>`) inside dedicated page components located in `/src/app/pages/`.

For instance, the `LoginComponent` in `/src/app/pages/login/` imports and uses the `<sup-login>` component in its template:

```typescript
// Example: src/app/pages/login/login.component.ts (snippet)
import { LoginComponent as SupabaseLoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  // ...,
  standalone: true,
  imports: [SupabaseLoginComponent], // Import the library component
  template: `
    <div class="flex justify-center ...">
      <sup-login (forgotPassword)="..." (signUp)="..." />
    </div>
  `,
})
export class LoginComponent {
  /* ... */
}
```

Other pages follow a similar pattern for their respective library components (`SignupComponent` uses `<sup-signup>`, `ProfileComponent` uses `<sup-profile>`, etc.).

### 3. State Management (`AuthStore`)

Components needing access to authentication state or needing to trigger authentication actions inject the `AuthStore` provided by the library.

```typescript
// Example: A component needing auth state (snippet)
import { computed, inject } from '@angular/core';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';

export class ExampleComponent {
  public readonly authStore = inject(AuthStore); // Inject the store

  // Access reactive state signals
  public user = computed(() => this.authStore.user());
  public isAuthenticated = computed(() => this.authStore.isAuthenticated());

  public logout(): void {
    this.authStore.signOut(); // Call store actions
  }
  // Other methods might call signInWithPassword(), updateUserProfile(), etc.
}
```

The `AuthStore` provides signals like `user()`, `profile()`, `session()`, `isAuthenticated()`, `isLoading()`, and methods for all core authentication operations.

### 4. Route Guards (`app.routes.ts`)

Access to specific routes is controlled using the `authGuard` (requires authentication) and `unauthGuard` (requires no authentication) provided by the library. These guards are added to the `canActivate` array in the route definitions within `app.routes.ts`.

```typescript
// src/app/app.routes.ts (snippet)
import { Routes } from '@angular/router';
import { authGuard, unauthGuard } from '@dotted-labs/ngx-supabase-auth';

export const routes: Routes = [
  {
    path: 'dashboard',
    // ...,
    canActivate: [authGuard], // Protected route: Requires login
  },
  {
    path: 'login',
    // ...,
    canActivate: [unauthGuard], // Public route: Accessible only when logged out
  },
  // ... other routes
];
```

## Customization

While this demo provides a functional baseline:

- **Styling:** You can customize the appearance by modifying Tailwind CSS classes directly in the page components or by adjusting the daisyUI theme in `tailwind.config.js`. The library components themselves offer limited styling hooks; major changes might require forking or wrapping the components.
- **Logic:** Extend the functionality by adding more pages, implementing specific business logic within components, or interacting further with the `AuthStore` or Supabase client directly (accessible via `this.authStore.supabaseClient`).

## Notes

- This demo focuses on illustrating the library's usage. For production, ensure robust error handling, security best practices (like environment variables for keys), and potentially features like email verification.
- The library components provide core authentication UI flows. You might need to build custom components for more complex or application-specific UI requirements.

This is a demo application and should not be used in production without making the necessary modifications. In a production environment, you should:

- Store Supabase credentials in environment variables
- Implement more robust error handling
- Consider additional features like email verification, account deletion, etc.
- Customize the UI according to your needs
