import { Component, OnInit, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { DEMO_LOCALES, getStoredLocale, setStoredLocale } from '../../demo-app/src/app/i18n/locale.storage';

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
    <router-outlet />
  `,
})
export class AppComponent implements OnInit {
  public readonly locales = DEMO_LOCALES;

  public readonly currentLocale = signal(getStoredLocale());

  public ngOnInit(): void {
    if (typeof window !== 'undefined' && window.electron) {
      console.log('Running in Electron');
      console.log('Platform:', window.electron.platform);
    } else {
      console.log('Running in web browser');
    }
  }

  public onLocaleChange(locale: string): void {
    if (locale === this.currentLocale()) {
      return;
    }

    setStoredLocale(locale);
  }
}
