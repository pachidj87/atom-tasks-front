import { Injectable, inject } from '@angular/core';
import {
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptor,
  HttpRequest
} from '@angular/common/http';
import { lastValueFrom, Observable } from 'rxjs';

import config from '../../environments/environment';
import { AuthService } from '../services/auth.service';

export function headerHttpInterceptor(request: HttpRequest<any>, next: HttpHandlerFn): Observable<HttpEvent<unknown>> {
  const authService = inject(AuthService);
  const isWhitelisted = whiteListedRoute(request);

  if (isWhitelisted) {
    return next(request);
  }

  const token = authService.getToken();

  let newRequest = request.clone({ setHeaders: { Authorization: `Bearer ${token}` } });

  return next(newRequest);
}

function whiteListedRoute(request: HttpRequest<any>): boolean {
  const endpoints = config.endpoints;
  let result = null;
  result = request.url.indexOf(endpoints.authToken) !== -1;
  result = result || (request.url.indexOf(endpoints.authRegister) !== -1);
  result = result || (request.url.indexOf(endpoints.verifyEmail) !== -1);
  result = result || (request.url.indexOf(endpoints.users) !== -1);

  return result;
}
