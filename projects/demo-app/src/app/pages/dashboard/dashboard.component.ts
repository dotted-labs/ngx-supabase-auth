import { Component, computed, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="max-w-md mx-auto p-8 rounded-lg shadow-md bg-white">
      <h1 class="mb-8 text-3xl text-center text-gray-800">Dashboard</h1>

      @if (user()) {
        <div class="mb-8">
          <h2 class="text-2xl text-gray-800 mb-4">Welcome, {{ username() }}</h2>
          <p class="text-gray-600 mb-2">Email: {{ email() }}</p>
          <p class="text-gray-600 mb-2">Last Sign In: {{ lastSignIn() }}</p>
        </div>
      }

      <div class="flex gap-4 justify-start">
        <button class="px-6 py-3 bg-blue-500 text-white font-medium rounded-md hover:bg-blue-600" (click)="navigateToProfile()">
          View Profile
        </button>
        <button class="px-6 py-3 bg-red-500 text-white font-medium rounded-md hover:bg-red-600" (click)="logout()">Sign Out</button>
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
