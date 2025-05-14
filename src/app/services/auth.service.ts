import { Injectable, inject } from "@angular/core";
import { HttpClient } from "@angular/common/http";

import { map } from "rxjs";
import * as jwt from "jwt-decode";

import { User } from "../common/interfaces/user.interface";
import env from "../../environments/environment";

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly http: HttpClient = inject(HttpClient);

  signin(user: User) {
    const url = `${env.appApiUrl}${env.endpoints.authToken}`;

    return this.http.post<any>(url, user)
      .pipe(
        map((response) => {
          const token = response.data?.token;
          if (!token) return false;

          sessionStorage.setItem('access_token', token);

          let currentUser = this.getCurrentUser();
          if (!currentUser) {
            const decoded: any = jwt.jwtDecode(token);
            currentUser = { id: decoded.id, email: decoded.email };
            this.setUser(currentUser);
          }

          return true;
        })
      );
  }

  signup(user: User) {
    const url = `${env.appApiUrl}${env.endpoints.authRegister}`;

    return this.http.post<any>(url, user)
      .pipe(
        map((response) => {
          const user = response.data;
          return this.setUser(user);
        })
      );
  }

  verifyEmail(email: string) {
    const url = `${env.appApiUrl}${env.endpoints.verifyEmail}`;

    return this.http.post<any>(url, { email })
      .pipe(
        map((response) => {
          const isValid = response.data?.isValid || false;
          return isValid;
        })
      );
  }

  signout(): Promise<boolean> {
    return new Promise((resolve) => {
      sessionStorage.removeItem('access_token');
      sessionStorage.removeItem('current_user');
      resolve(true);
    });
  }

  isTokenExpired(token: string): boolean {
    if (!token) return true;

    const decoded = jwt.jwtDecode(token);
    if (!decoded || !decoded.exp) return true;

    const now = Date.now();
    return now >= decoded.exp * 1000;
  }

  getToken() {
    const token = sessionStorage.getItem('access_token');

    if (!token) return null;

    const isTokenExpired = this.isTokenExpired(token);

    // Check token expiration
    if (isTokenExpired) return null;

    return token;
  }

  getCurrentUser(): User | null {
    let user: User | null = JSON.parse(sessionStorage.getItem('current_user') || '{}');
    user = user?.id ? user : null;
    return user;
  }

  private setUser(data: any) {
    const user: User = data;
    if (!user.email) return false;

    sessionStorage.setItem('current_user', JSON.stringify(user));

    return true;
  }
}
