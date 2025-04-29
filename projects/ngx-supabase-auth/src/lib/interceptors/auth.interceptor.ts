import { HttpInterceptorFn, HttpRequest, HttpHandlerFn, HttpContextToken } from '@angular/common/http';
import { inject } from '@angular/core';
import { SupabaseAuthService } from '../services/auth.service';
import { Observable, from, switchMap } from 'rxjs';

export const skipAuthInterceptor = new HttpContextToken<boolean>(() => false);

export const authInterceptor: HttpInterceptorFn = (req: HttpRequest<unknown>, next: HttpHandlerFn): Observable<any> => {
  const authService = inject(SupabaseAuthService);

  // Skip token addition if the request has the skipAuthInterceptor flag
  if (req.context.get(skipAuthInterceptor)) {
    return next(req);
  }

  // Convert the promise to an observable and use switchMap to maintain the observable chain
  return from(authService.getToken()).pipe(
    switchMap((token) => {
      // Only clone and add headers if we have a token
      if (token) {
        const authReq = req.clone({
          setHeaders: {
            Authorization: `Bearer ${token}`,
          },
        });
        return next(authReq);
      }

      // Pass the original request if no token is available
      return next(req);
    }),
  );
};
