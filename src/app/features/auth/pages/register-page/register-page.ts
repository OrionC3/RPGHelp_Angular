import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';
import { LoadingService } from '@core/services/loading-service';
import { strongPasswordValidator } from '@core/validators';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-register-page',
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './register-page.html',
  styleUrl: './register-page.scss',
})
export class RegisterPage {
  // injection de services
  private readonly _fb = inject(FormBuilder);
  private readonly _authService = inject(AuthService);
  private readonly _loading = inject(LoadingService);
  private readonly _router = inject(Router);

  // Form controls (utilisés dans le template pour récupérer les erreurs)
  
  email = new FormControl('', [Validators.required, Validators.email]);
  password = new FormControl('', [Validators.required, strongPasswordValidator()]);

  // Form group
  registerForm = this._fb.group({
    email: this.email,
    password: this.password,
  });

  registerError = '';

  onSubmit() {
  if (!this.registerForm.valid) return;

  this._loading.show(); // affiche le spinner

  this._authService
    .register({
      email: this.registerForm.value.email!,
      password: this.registerForm.value.password!,
    })
    .then(() => {
      // redirection après succès
      this._router.navigate(['/auth/login']);
    })
    .catch((err) => {
      console.error(err);
      this.registerError = err.message;
    })
    .finally(() => {
      // 🔹 toujours masquer le spinner
      this._loading.hide();
    });
}

}