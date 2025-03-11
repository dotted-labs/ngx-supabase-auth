import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-md mx-auto card card-border bg-base-100 card-sm">
      <div class="card-body">
        <h1 class="mb-8 text-3xl text-center">Dashboard</h1>

        @if (user()) {
          <div class="mb-8">
            <h2 class="text-2xl mb-4">Welcome, {{ username() }}</h2>
            <p class="text-base-content/70 mb-2">Email: {{ email() }}</p>
            <p class="text-base-content/70 mb-2">Last Sign In: {{ lastSignIn() }}</p>
          </div>
        }

        <div class="flex gap-4 justify-start">
          <button class="btn btn-primary" (click)="navigateToProfile()">View Profile</button>
          <button class="btn btn-error" (click)="logout()">Sign Out</button>
        </div>
      </div>
    </div>
  `,
})
export class DashboardComponent {
  private router = inject(Router);
  public authStore = inject(AuthStore);

  public user = computed(() => this.authStore.user());
  public username = computed(() => this.user()?.user_metadata?.['name'] || this.user()?.email?.split('@')[0] || 'User');
  public lastSignIn = computed(() => this.user()?.last_sign_in_at);
  public email = computed(() => this.user()?.email);

  public navigateToProfile(): void {
    this.router.navigate(['/profile']);
  }

  public logout(): void {
    this.authStore.signOut();
  }
}
