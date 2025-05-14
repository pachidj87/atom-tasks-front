import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  FormGroup,
  FormsModule,
  ReactiveFormsModule,
  Validators,
  FormControl,
  AbstractControl
} from '@angular/forms';
import { RouterModule, Router } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatInputModule } from '@angular/material/input';
import { MatButton } from '@angular/material/button';

import { firstValueFrom } from 'rxjs';

import { PageSubtitleService } from "../../services/page-subtitle.service";
import { AuthService } from '../../services/auth.service';
import { FormPageComponent } from "../../common/components/form-page.component";
import { matchValidator } from "../../common/validators/match.validator";
import { User } from '../../common/interfaces/user.interface';

@Component({
  selector: 'app-registration-page',
  standalone: true,
  imports: [
    CommonModule,
    MatButton,
    FormsModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatIconModule,
    MatInputModule,
    RouterModule
  ],
  templateUrl: './registration-page.component.html',
  styleUrl: './registration-page.component.scss'
})
export class RegistrationPageComponent extends FormPageComponent implements OnInit {
  visible = { password: false, passwordConfirmation: false };
  showError = false;

  constructor(
    private readonly subtitleService: PageSubtitleService,
    private readonly authService: AuthService,
    private readonly router: Router
  ) {
    super();
  }

  ngOnInit() {
    this.subtitleService.setSubtitle("Registro de Usuario");
    const { email } = history.state || {};

    this.form = new FormGroup({
      email: new FormControl(email, [Validators.required, Validators.email]),
      password: new FormControl('', [Validators.required, Validators.minLength(8), matchValidator('passwordConfirmation')]),
      passwordConfirmation: new FormControl('', [Validators.required, matchValidator('password')])
    });
  }

  async createAccount() {
    this.showError = false;
    const { email, password } = this.form.value;
    const user: User = { email, password };

    const register$ = this.authService.signup(user);
    const result = await firstValueFrom(register$)
      .catch(error => {
        // handle registration error
        return false;
      });

    if (!result) {
      this.showError = true;
      return;
    }

    this.loginAfterCreate(user);
  }

  async loginAfterCreate(user: User) {
    this.showError = false;
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
}
