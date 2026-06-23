import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DEMO_LOCALES, getStoredLocale, setStoredLocale } from './i18n/locale.storage';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet],
  template: `
    <header class="flex justify-end gap-2 p-4">
      @for (locale of locales; track locale) {
        <button
          type="button"
          class="btn btn-sm"
          [class.btn-primary]="currentLocale() === locale"
          [class.btn-ghost]="currentLocale() !== locale"
          (click)="onLocaleChange(locale)"
        >
          {{ locale.toUpperCase() }}
        </button>
      }
    </header>
    <main class="container mx-auto w-96">
      <router-outlet />
    </main>
  `,
})
export class AppComponent {
  public readonly locales = DEMO_LOCALES;

  public readonly currentLocale = signal(getStoredLocale());

  public onLocaleChange(locale: string): void {
    if (locale === this.currentLocale()) {
      return;
    }

    setStoredLocale(locale);
  }
}
