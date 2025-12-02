import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Router } from '@angular/router';
import { ApiError } from '@core/models/api-error.model';
import { catchError, throwError } from 'rxjs';

export const errorInterceptor: HttpInterceptorFn = (req, next) => {
  // Inject Router
  const router = inject(Router);

  // Lorsque la requête HTTP est terminée
  return next(req).pipe(
    // intercepter les erreurs
    catchError((error: HttpErrorResponse) => {
      console.log('errorInterceptor', error);

      // Gérer les erreurs en fonction du code d'état HTTP
      switch (error.status) {
        case 401:
          // En cas d'erreur 401 (non autorisé), rediriger vers la page de connexion
          router.navigate(['/', 'auth', 'login']);
          break;
        case 403:
          // En cas d'erreur 403 (interdit), rediriger vers la page d'erreur 403
          router.navigate(['/', 'error', '403']);
          break;
        case 404:
          // En cas d'erreur 404 (non trouvé), rediriger vers la page d'erreur 404
          router.navigate(['/', 'error', '404']);
          break;
        case 500:
        case 0:
          // En cas d'erreur 500 (erreur serveur) ou 0 (erreur réseau), rediriger vers la page d'erreur 500
          router.navigate(['/', 'error', '500']);
          break;
        default:
        /* Nothing. */
      }

      // Propager l'erreur sous forme d'ApiError (à adapter selon votre modèle d'erreur retourner par l'API)
      return throwError(() => new ApiError(error.error.error));
    }),
  );
};
