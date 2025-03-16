import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { AuthStore } from '@dotted-labs/ngx-supabase-auth';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  template: `
    <main class="container mx-auto p-4">
      <section class="card bg-base-100 shadow-xl">
        <div class="card-body">
          <div class="flex justify-between items-center">
            <h2 class="card-title text-2xl">Dashboard</h2>
            <button class="btn btn-sm btn-outline" (click)="logout()">Cerrar sesión</button>
          </div>

          <div class="divider"></div>

          @if (store.user()) {
            <div class="py-4">
              <h3 class="text-xl mb-4">Información del usuario</h3>
              <div class="stats shadow">
                <div class="stat">
                  <div class="stat-title">Email</div>
                  <div class="stat-value text-lg">{{ store.user()?.email }}</div>
                </div>

                <div class="stat">
                  <div class="stat-title">ID</div>
                  <div class="stat-value text-lg">{{ store.user()?.id }}</div>
                </div>

                <div class="stat">
                  <div class="stat-title">Último acceso</div>
                  <div class="stat-value text-lg">{{ store.user()?.last_sign_in_at | date: 'medium' }}</div>
                </div>
              </div>
            </div>
          } @else {
            <div class="alert alert-warning">No hay usuario autenticado</div>
          }

          <div class="card-actions mt-4">
            <button class="btn btn-primary" (click)="goToProfile()">Ir a perfil</button>
          </div>
        </div>
      </section>
    </main>
  `,
  styleUrl: './dashboard.component.scss',
})
export class DashboardComponent {
  public readonly store = inject(AuthStore);
  public readonly router = inject(Router);

  logout() {
    this.store.signOut();
  }

  goToProfile() {
    this.router.navigate(['/profile']);
  }
}
