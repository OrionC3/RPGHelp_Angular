import { inject } from '@angular/core';
import { CanActivateChildFn, Router } from '@angular/router';
import { UserRole } from '@core/enums';
import { AuthService } from '@core/services/auth.service';

export const adminGuard: CanActivateChildFn = (childRoute, state) => {
  // injection des dépendances
  const authService = inject(AuthService);
  const router = inject(Router);

  // vérifier le rôle de l'utilisateur
  if (authService.role() === UserRole.Admin) {
    // l'utilisateur est admin, autoriser l'accès
    return true;
  }

  // l'utilisateur n'est pas admin, rediriger vers 404
  router.navigate(['/', 'error', '404']);

  // refuser l'accès (retourner false)
  return false;
};
