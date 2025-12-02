import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const isNotConnectedGuard: CanActivateFn = (route, state) => {
  // injection des dépendances
  const authService = inject(AuthService);
  const router = inject(Router);

  // vérification de la connexion via le signal du service
  if (!authService.isConnected()) {
    // utilisateur non connecté
    return true;
  }

  // utilisateur connecté, redirection vers home
  router.navigate(['/']);
  return false;
};
