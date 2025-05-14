import { inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptor,
  HttpRequest,
  HttpContextToken
} from '@angular/common/http';

import { finalize, Observable } from 'rxjs';

import { LoadingService } from '../services/loading.service';

export const SkipLoading = new HttpContextToken<boolean>(() => false);

export function loadingHttpInterceptor(req: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const loadingService = inject(LoadingService);

  // Check for a custom attribute
  // to avoid showing loading spinner
  if (req.context.get(SkipLoading)) {
    // Pass the request directly to the next handler
    return next(req);
  }

  // Turn on the loading spinner
  loadingService.start();

  return next(req).pipe(
    finalize(() => {
      // Turn off the loading spinner
      loadingService.stop();
    })
  );
}
