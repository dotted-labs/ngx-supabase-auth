import { bootstrapApplication } from '@angular/platform-browser';
import { appConfig } from './app/app.config';
import { AppComponent } from './app/app.component';
import { bootstrapTranslations } from './app/i18n/bootstrap-translations';
import { syncLocaleFromDesktopHandoff } from './app/i18n/sync-locale-from-desktop-handoff';

syncLocaleFromDesktopHandoff();

bootstrapTranslations()
  .then(() => bootstrapApplication(AppComponent, appConfig))
  .catch((err) => console.error(err));
