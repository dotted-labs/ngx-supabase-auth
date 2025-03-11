# ngx-supabase-auth Demo Application

Esta es una aplicación de demostración que muestra cómo utilizar la biblioteca ngx-supabase-auth en un proyecto Angular.

## Características

- Página de inicio de sesión con opciones de inicio de sesión social
- Página de restablecimiento de contraseña
- Página de perfil de usuario
- Dashboard protegido con información del usuario
- Implementación de guards de autenticación
- Uso del AuthStore para gestionar el estado de autenticación

## Estructura del Proyecto

```
/demo-app
  /src
    /app
      /pages
        /dashboard      - Página principal después del inicio de sesión
        /login          - Página de inicio de sesión
        /password-reset - Página de recuperación de contraseña
        /profile        - Página de perfil de usuario
      app.component.ts  - Componente raíz de la aplicación
      app.config.ts     - Configuración de la aplicación, incluida la configuración de Supabase
      app.routes.ts     - Configuración de rutas con guards de autenticación
```

## Cómo Ejecutar

Para ejecutar esta aplicación de demostración:

1. Asegúrate de tener Node.js y npm instalados
2. Configura tus credenciales de Supabase en `app.config.ts`
3. Ejecuta los siguientes comandos:

```bash
# Navegar al directorio raíz del proyecto
cd ngx-supabase-auth

# Instalar dependencias
npm install

# Ejecutar la aplicación de demostración
ng serve demo-app
```

4. Abre tu navegador en `http://localhost:4200`

## Ejemplos de Uso

### Uso de Componentes

La aplicación demuestra cómo usar los componentes proporcionados por la biblioteca:

```typescript
// En un componente
import { LoginComponent } from '@dotted-labs/ngx-supabase-auth';

@Component({
  imports: [LoginComponent],
  template: `<sup-login (forgotPassword)="onForgotPassword()"></sup-login>`
})
```

### Uso del AuthStore

```typescript
// En un componente
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
}
```

### Protección de Rutas

```typescript
// En la configuración de rutas
import { authGuard, unauthGuard } from '@dotted-labs/ngx-supabase-auth';

export const routes: Routes = [
  {
    path: 'dashboard',
    component: DashboardComponent,
    canActivate: [authGuard] // Ruta protegida, requiere autenticación
  },
  {
    path: 'login',
    component: LoginComponent,
    canActivate: [unauthGuard] // Ruta solo accesible si NO está autenticado
  }
];
```

## Notas

Esta es una aplicación de demostración y no debe usarse en producción sin realizar las modificaciones necesarias. En un entorno de producción, deberías:

- Almacenar las credenciales de Supabase en variables de entorno
- Implementar un manejo de errores más robusto
- Considerar características adicionales como registro de usuarios, verificación de correo electrónico, etc.
- Personalizar la UI según tus necesidades 