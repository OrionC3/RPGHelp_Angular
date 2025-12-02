import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '@core/services/auth.service';

export const isConnectedGuard: CanActivateFn = (route, state) => {
  // injection des dépendances
  const authService = inject(AuthService);
  const router = inject(Router);

  // vérification de la connexion via le signal du service
  if (authService.isConnected()) {
    // utilisateur connecté
    return true;
  }

  // utilisateur non connecté, navigate vers page login
  router.navigate(['/', 'auth', 'login']);
  return false;
};
