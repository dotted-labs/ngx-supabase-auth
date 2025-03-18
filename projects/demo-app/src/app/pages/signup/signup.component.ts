import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { SignupComponent as SupSignupComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-signup-page',
  imports: [SupSignupComponent],
  template: `
    <div class="max-w-md mx-auto card card-border bg-base-100 border-base-300 card-sm">
      <div class="card-body">
        <sup-signup (backToLogin)="onBackToLogin()"></sup-signup>
      </div>
    </div>
  `,
})
export class SignupPageComponent {
  constructor(private router: Router) {}

  onBackToLogin() {
    this.router.navigate(['/login']);
  }
}
