import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { LoginComponent as SupLoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [SupLoginComponent],
  template: `
    <div class="max-w-md mx-auto p-8 rounded-lg shadow-md bg-white">
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
    // En una aplicación real, esto podría redirigir a una página de registro
    alert('Sign up functionality would be implemented here in a real application');
  }
}
