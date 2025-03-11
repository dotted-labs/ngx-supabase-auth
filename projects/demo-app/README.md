# ngx-supabase-auth Demo Application

This is a demo application that shows how to use the ngx-supabase-auth library in an Angular project.

## Features

- Login page with social login options
- Signup page for new user registration
- Password reset page
- User profile page
- Protected dashboard with user information
- Implementation of authentication guards
- Use of AuthStore for managing authentication state

## Project Structure

```
/demo-app
  /src
    /app
      /pages
        /dashboard      - Main page after login
        /login          - Login page
        /signup         - Signup page
        /password-reset - Password recovery page
        /profile        - User profile page
      app.component.ts  - Root application component
      app.config.ts     - Application configuration, including Supabase setup
      app.routes.ts     - Route configuration with authentication guards
```

## How to Run

To run this demo application:

1. Make sure you have Node.js and npm installed
2. Configure your Supabase credentials in `app.config.ts`
3. Run the following commands:

```bash
# Navigate to the project root directory
cd ngx-supabase-auth

# Install dependencies
npm install

# Run the demo application
ng serve demo-app
```

4. Open your browser at `http://localhost:4200`

## Usage Examples

### Using Components

The application demonstrates how to use the components provided by the library:

```typescript
// In a component
import { LoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  imports: [LoginComponent],
  template: `<sup-login (forgotPassword)="onForgotPassword()"></sup-login>`
})
```

### Using the Signup Component

```typescript
// In a component
import { SignupComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  imports: [SignupComponent],
  template: `<sup-signup (backToLogin)="onBackToLogin()"></sup-signup>`
})
```

### Using the AuthStore

```typescript
// In a component
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';

@Component({
  // ...
})
export class MyComponent {
  authStore = inject(AuthStore);
  
  isLoggedIn = computed(() => this.authStore.isAuthenticated());
  
  logout() {
    this.authStore.signOut();
  }
  
  register(email: string, password: string) {
    this.authStore.signUpWithEmail(email, password);
  }
}
```

### Route Protection

```typescript
// In the route configuration
import { authGuard, unauthGuard } from '@dotted-labs/ngx-supabase-auth';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard] // Protected route, requires authentication
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [unauthGuard] // Route only accessible if NOT authenticated
  },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [unauthGuard] // Route only accessible if NOT authenticated
  }
];
```

## Notes

This is a demo application and should not be used in production without making the necessary modifications. In a production environment, you should:

- Store Supabase credentials in environment variables
- Implement more robust error handling
- Consider additional features like email verification, account deletion, etc.
- Customize the UI according to your needs 