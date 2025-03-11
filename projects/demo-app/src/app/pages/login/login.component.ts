import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent as SupLoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [SupLoginComponent],
  template: `
    <div class="container">
      <h1 class="app-title text-2xl font-bold">Demo Application</h1>
      <sup-login
        title="Welcome Back"
        subtitle="Log in to access your account"
        (forgotPassword)="onForgotPassword()"
        (signUp)="onSignUp()"
      ></sup-login>
    </div>
  `,
})
export class LoginPageComponent {
  constructor(private router: Router) {}

  onForgotPassword() {
    this.router.navigate(['/forgot-password']);
  }

  onSignUp() {
    // En una aplicación real, esto podría redirigir a una página de registro
    alert(
      'Sign up functionality would be implemented here in a real application'
    );
  }
}
