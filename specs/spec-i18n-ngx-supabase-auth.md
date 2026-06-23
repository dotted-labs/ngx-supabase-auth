# Spec: i18n en `ngx-supabase-auth`

## Objetivo
Internacionalizar el paquete con `$localize` de Angular para que herede el cambio de idioma runtime de la app consumidora. El paquete **aporta** mensajes; no gestiona runtime.

## Namespace
Todos los IDs bajo `@@auth.*`.

## Pasos

### 1. Dependencias
- `package.json`: añadir `@angular/localize` a **`peerDependencies`** (`^21.0.0`). Nunca `dependencies`.

### 2. Marcar textos con IDs custom
Recorrer todos los componentes/templates del paquete y marcar cada string con ID namespaced.

Plantillas:
```html
<h1 i18n="@@auth.login.title">Iniciar sesión</h1>
<button i18n="@@auth.login.submit">Entrar</button>
```
TypeScript:
```ts
const err = $localize`:@@auth.login.invalidCredentials:Credenciales inválidas`;
```

Convención de IDs: `auth.<feature>.<elemento>` (p.ej. `auth.signup.emailLabel`, `auth.resetPassword.success`).

### 3. Extraer mensajes
```bash
ng extract-i18n ngx-supabase-auth --output-path src/i18n --format json
```
Genera `messages.json` (source). Traducir a `messages.es.json`, `messages.en.json`, etc.

### 4. Publicar traducciones en el paquete
- Ubicar los JSON en `src/i18n/` y configurar `ng-packagr` / assets para que se copien al `dist` publicado.
- Estructura final en el paquete publicado: `@vendor/ngx-supabase-auth/i18n/messages.{locale}.json`.

### 5. Exportar loader (entry point `i18n`)
```ts
// ngx-supabase-auth/i18n/index.ts
export const AUTH_LOCALES = ['es', 'en'] as const;

export const loadAuthMessages = async (locale: string) => {
  try { return await import(`./messages.${locale}.json`); }
  catch { return await import('./messages.en.json'); } // fallback
};
```
Configurar secondary entry point en `ng-package.json` para `i18n`.

### 6. No registrar nada
El paquete **no** llama a `loadTranslations` ni inicializa `LOCALE_ID`. Solo expone `loadAuthMessages`.

## Reglas
- IDs siempre `@@auth.*` (sin autogenerados por hash → evita colisión con la app).
- `@angular/localize` = peerDependency.
- La app fusiona `loadAuthMessages(locale)` en su `loadTranslations` existente.
- `$localize` evalúa una vez por render: el cambio en caliente lo controla la app.

## Entregable de cara a la app consumidora
Documentar en el README: entry point `@vendor/ngx-supabase-auth/i18n`, locales disponibles, y que debe fusionarse en `loadTranslations` antes del bootstrap.
