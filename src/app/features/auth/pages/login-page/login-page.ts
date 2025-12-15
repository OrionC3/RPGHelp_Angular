import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { PasswordInput } from "@components/form/password-input/password-input";
import { ApiError } from "@core/models/api-error.model";
import { AuthService } from "@core/services/auth.service";
import { strongPasswordValidator } from "@core/validators";
import { TranslatePipe } from "@ngx-translate/core";
import { LoadingService } from "@core/services/loading-service";

@Component({
  selector: 'app-login-page',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, PasswordInput],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {

  // Services injectés
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);
  private readonly _loading = inject(LoadingService);

  // Champs individuels
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, strongPasswordValidator()]);

  // Form group
  loginForm = this._fb.group({
    email: this.email,
    password: this.password,
  });

  loginError = '';

  async onSubmit() {
    // Vérification de la validité du formulaire
    if (!this.loginForm.valid) {
      return;
    }

    // ⏳ Affiche le spinner pendant l’appel
    this._loading.show();

    try {
      // Tentative de connexion
      await this._authService.login(
        this.loginForm.value.email!,
        this.loginForm.value.password!
      );

      // Redirection après succès
      this._router.navigate(['/']);

    } catch (err) {
      console.error(err);
      this.loginError = (err as ApiError).message;

    } finally {
      // 🔥 Masque le spinner dans tous les cas (succès ou échec)
      this._loading.hide();
    }
  }
}
