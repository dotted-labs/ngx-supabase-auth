# Spec: sincronización de locale Electron → navegador (auth desktop)

## Objetivo

Mantener el mismo **Locale preference** en Electron y en el navegador del sistema cuando el usuario inicia auth desktop (`/login`, `/signup` con `desktop=true`).

Sin esto, Electron puede tener `fanship.locale = en-US` mientras el navegador externo resuelve `es` vía `navigator.language`, mezclando idiomas entre `sup-login-desktop` y `sup-login`.

## Principio

Electron y el navegador del sistema **no comparten `localStorage`**. Fijar `fanship.locale` en Electron antes de `window.open` no afecta al navegador externo.

**Solución:** pasar el locale como query param en la URL de handoff y persistirlo en el bootstrap web **antes** de `resolveActiveLocale()` y `applyLocale()`.

## Diagnóstico

| Contexto               | `localStorage.getItem('fanship.locale')` | Resolución típica           |
| ---------------------- | ---------------------------------------- | --------------------------- |
| Electron (app desktop) | `en-US` (o `es`)                         | Valor persistido            |
| Navegador externo      | `null`                                   | `navigator.language` → `es` |

Flujo actual (problemático):

1. Electron muestra `/login-desktop` con locale correcto.
2. `LoginDesktopComponent` llama `openExternalAuthWindow('login')` → abre `{webAppAuthUrl}/login?desktop=true`.
3. Navegador arranca sin `fanship.locale` → UI auth en español aunque Electron esté en inglés.

## Contrato URL

| Param     | Valores         | Obligatorio            | Notas                                            |
| --------- | --------------- | ---------------------- | ------------------------------------------------ |
| `desktop` | `true`          | Sí                     | Ya existente; indica flujo Electron              |
| `locale`  | `en-US` \| `es` | Sí en handoff Electron | Debe coincidir con `SUPPORTED_LOCALES` de la app |

Ejemplos:

- `http://localhost:4200/login?desktop=true&locale=en-US`
- `https://production.fanship.com/signup?desktop=true&locale=es`

## Emisión (librería `@dotted-labs/ngx-supabase-auth`)

La librería ya propaga query params extra en `openExternalAuthWindow`:

```ts
const queryParams = new URLSearchParams({
  desktop: 'true',
  ...options,
});
const authUrl = `${this.config.webAppAuthUrl}/${path}?${queryParams.toString()}`;
```

### Cambios requeridos en la librería

1. Añadir a `SupabaseAuthConfig`:

   ```ts
   /** localStorage key donde la app guarda el locale activo. Default: 'fanship.locale' */
   localeStorageKey?: string;
   ```

2. En `LoginDesktopComponent.login()` y `.signup()`:

   ```ts
   const locale = localStorage.getItem(config.localeStorageKey ?? 'fanship.locale');
   this.store.openExternalAuthWindow(path, locale ? { locale } : {});
   ```

3. Default en `provideSupabaseAuth`: `localeStorageKey: 'fanship.locale'`.

4. Documentar en README de la librería.

### Alternativa descartada

**Fijar `localStorage` antes de abrir el navegador** — no funciona entre contextos Electron y navegador del sistema.

## Recepción (app `apps/app`)

### Nueva utilidad: `syncLocaleFromDesktopHandoff()`

Ubicación: `apps/app/src/app/core/i18n/sync-locale-from-desktop-handoff.ts`

Reglas:

1. Solo actúa si `desktop=true` en `window.location.search`.
2. Lee el query param `locale`.
3. Valida contra `SUPPORTED_LOCALES` (reutilizar `matchLocale` de `resolve-active-locale.ts`).
4. Si válido → `localStorage.setItem(STORAGE_KEY, locale)` **antes** de resolver locale.
5. Si inválido o ausente → no modifica `localStorage` (fallback: localStorage → navigator → `en-US`).
6. Opcional: `history.replaceState` para eliminar `locale` de la URL sin reload (bootstrap aún no ha ocurrido).

```ts
export function syncLocaleFromDesktopHandoff(): void {
  const params = new URLSearchParams(window.location.search);
  if (params.get('desktop') !== 'true') return;

  const localeParam = params.get('locale');
  if (!localeParam) return;

  const match = matchLocale(localeParam);
  if (!match) return;

  localStorage.setItem(STORAGE_KEY, match);
}
```

### Orden en bootstrap (`main.ts`)

```ts
syncLocaleFromDesktopHandoff();
const locale = resolveActiveLocale();
await applyLocale(locale);
await registerLocaleDataFor(locale);
await bootstrapApplication(...);
```

`syncLocaleFromDesktopHandoff()` debe ejecutarse **antes** de `resolveActiveLocale()` para que `applyLocale()` cargue las traducciones correctas en el primer render.

### Otros cambios en app

| Archivo                    | Cambio                                                                                   |
| -------------------------- | ---------------------------------------------------------------------------------------- |
| `resolve-active-locale.ts` | Exportar `matchLocale` (hoy privada)                                                     |
| `main.ts`                  | Llamar `syncLocaleFromDesktopHandoff()` al inicio de `bootstrap()`                       |
| `package.json`             | Bump `@dotted-labs/ngx-supabase-auth` cuando se publique versión con emisión de `locale` |

No hace falta tocar `login-desktop.component.ts` de la app si la librería emite el param.

## Fuera de alcance

- Hot-switch de idioma sin reload.
- Sincronizar locale post-login vía Supabase (`LocaleStore` ya lo cubre).
- Cambiar la prioridad global de `resolveActiveLocale` fuera del handoff `desktop=true`.
- Pasar locale en rutas que no sean auth desktop.

## Reglas

- El param `locale` en URL solo tiene efecto con `desktop=true` (handoff explícito Electron).
- Valores de locale deben ser exactamente los de `SUPPORTED_LOCALES` (`en-US`, `es`).
- La app es dueña del ciclo de vida del locale; la librería solo **emite** el valor en la URL.
- Tras persistir en `localStorage`, el resto del flujo i18n existente (ADR 0003, `applyLocale`, reload en Settings) no cambia.

## Verificación

1. Electron con `fanship.locale = en-US` → Sign In → navegador abre `/login?desktop=true&locale=en-US` → `sup-login` en inglés.
2. Electron con `fanship.locale = es` → Sign Up → navegador en español.
3. Navegador web normal (sin `desktop=true`) → comportamiento actual sin cambios.
4. URL con `locale=fr&desktop=true` → param ignorado, fallback a navigator / `en-US`.
5. Recepción verificable manualmente añadiendo `&locale=en-US` a la URL antes de implementar la emisión en librería.
