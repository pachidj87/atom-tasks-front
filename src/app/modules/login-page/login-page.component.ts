import { Component, OnInit, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from "@angular/router";
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatDialog } from '@angular/material/dialog';

import { firstValueFrom, filter, tap } from 'rxjs';

import { PageSubtitleService } from "../../services/page-subtitle.service";
import { AuthService } from "../../services/auth.service";
import { FormPageComponent } from "../../common/components/form-page.component";
import { DialogComponent } from '../../common/components/dialog/dialog.component';


@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    FormsModule,
    RouterModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule
  ],
  templateUrl: './login-page.component.html',
  styleUrl: './login-page.component.scss'
})
export class LoginPageComponent extends FormPageComponent implements OnInit {
  private readonly dialog = inject(MatDialog);
  private readonly router = inject(Router);

  isEmailVerified: boolean = false;
  passwordVisible: boolean = false;
  showError: boolean = false;

  constructor(
    private readonly subtitleService: PageSubtitleService,
    private readonly authService: AuthService
  ) {
    super();
  }

  ngOnInit() {
    this.subtitleService.setSubtitle("Inicio de sesión");

    this.form = new FormGroup({
      email: new FormControl('', [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8)])
    });
  }

  async verifyEmail() {
    this.showError = false;
    const email = this.form.get('email')?.value;
    // const verify$ = this.authService.verifyEmail(email);
    const verify$ = this.authService.verifyEmail(email);

    let notFoundUser = false;
    const result = await firstValueFrom(verify$)
      .catch((error: any) => {
        notFoundUser = error.error.name === "NotFoundError";
        return false;
      });

    if (notFoundUser) {
      if (this.subscription) {
        this.subscription.unsubscribe();
      }

      const dialogRef = this.dialog.open(DialogComponent, {
        width: '350px',
        data: {
          title: 'Usuario no encontrado',
          message: 'No se encontró un usuario con este correo electrónico. Deseas crear una cuenta?',
          cancelButtonText: 'Cancelar',
          confirmButtonText: 'Crear cuenta',
        }
      });

      this.subscription = dialogRef.afterClosed()
        .pipe(
          filter(result => !!result),
          tap((result: boolean) => {
            this.router.navigate(['/registration'], { state: { email } });
          })
        )
        .subscribe();
    }

    this.isEmailVerified = result;
  }

  async login() {
    this.showError = false;
    const user = this.form.value;
    const login$ = this.authService.signin(user);
    const response = await firstValueFrom(login$)
      .catch(error => {
        // handle error
        return false;
      });

    if (!response) {
      this.showError = true;
      return;
    }

    this.router.navigate(['/tasks']);
  }

  get isButtonDisabled(): boolean | null {
    const emailControl: AbstractControl | null = this.form.get('email');
    const isDisabled = emailControl?.invalid || this.isEmailVerified || null;
    return isDisabled;
  }
}
