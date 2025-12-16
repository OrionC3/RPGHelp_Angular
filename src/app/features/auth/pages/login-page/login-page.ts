import { Component, inject } from '@angular/core';
import {
  ReactiveFormsModule,
  FormBuilder,
  FormControl,
  Validators
} from '@angular/forms';
import { Router } from '@angular/router';

import { PasswordInput } from '@components/form/password-input/password-input';
import { FormErrorsComponent } from '@components/form/form-errors/form-errors';

import { TranslatePipe } from '@ngx-translate/core';

import { AuthService } from '@core/services/auth.service';
import { LoadingService } from '@core/services/loading-service';
import { ApiError } from '@core/models/api-error.model';

import { strongPasswordValidator } from '@core/validators';

@Component({
  selector: 'app-login-page',
  standalone: true,
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    PasswordInput,
    FormErrorsComponent
  ],
})
export class LoginPage {

  // 🔧 Services injectés
  private readonly fb = inject(FormBuilder);
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly loading = inject(LoadingService);

  // 📧 FormControls
  readonly email = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, Validators.email],
  });

  readonly password = new FormControl<string>('', {
    nonNullable: true,
    validators: [Validators.required, strongPasswordValidator()],
  });

  // 🧾 FormGroup
  readonly loginForm = this.fb.group({
    email: this.email,
    password: this.password,
  });

  // ❌ Erreur backend éventuelle
  loginError = '';

  async onSubmit(): Promise<void> {
    if (this.loginForm.invalid) {
      // Marque tout comme touché pour afficher les erreurs
      this.loginForm.markAllAsTouched();
      return;
    }

    this.loading.show();

    try {
      await this.authService.login(
        this.email.value,
        this.password.value
      );

      this.router.navigate(['/']);
    } catch (err) {
      console.error(err);
      this.loginError = (err as ApiError).message;
    } finally {
      this.loading.hide();
    }
  }
}
