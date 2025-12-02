import { Component, inject } from "@angular/core";
import { ReactiveFormsModule, FormBuilder, FormControl, Validators } from "@angular/forms";
import { Router } from "@angular/router";
import { PasswordInput } from "@components/form/password-input/password-input";
import { ApiError } from "@core/models/api-error.model";
import { AuthService } from "@core/services/auth.service";
import { strongPasswordValidator } from "@core/validators";
import { TranslatePipe } from "@ngx-translate/core";

@Component({
  selector: 'app-login-page',
  imports: [ReactiveFormsModule, TranslatePipe, PasswordInput],
  templateUrl: './login-page.html',
  styleUrl: './login-page.scss',
})
export class LoginPage {
  // Injection de services
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _router = inject(Router);

  // Form controls (utilisés dans le template pour récupérer les erreurs)
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
    if (this.loginForm.valid) {
      // formulaire valide, on peut tenter de se connecter
      try {
        await this._authService.login(this.loginForm.value.email!, this.loginForm.value.password!);
        // connexion réussie, redirigé vers la page d'accueil
        this._router.navigate(['/']);
      } catch (err) {
        // connexion échouée, on affiche l'erreur
        console.error(err);
        this.loginError = (err as ApiError).message;
      }
    }
  }
}
