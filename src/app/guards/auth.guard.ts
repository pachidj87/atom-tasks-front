import { Injectable } from '@angular/core'
import { CanActivate, Router } from "@angular/router";

import { AuthService } from '../services/auth.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    protected readonly authService: AuthService,
    protected readonly router: Router,
  ) {}

  async canActivate(): Promise<boolean> {
    const token = this.authService.getToken() || '';

    const user = this.authService.getCurrentUser();
    const isTokenExpired = this.authService.isTokenExpired(token);
    if (!user || !token || isTokenExpired) {
      await this.authService.signout();
      this.router.navigate(['/login']);
      return false;
    }

    return true;
  }
}
