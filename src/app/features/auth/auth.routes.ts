import { Routes } from '@angular/router';
import { isNotConnectedGuard } from '@core/guards';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },
  {
    path: 'login',
    canActivate: [isNotConnectedGuard],
    loadComponent: () => import('./pages/login-page/login-page').then((c) => c.LoginPage),
  },
  {
    path: 'register',
    canActivate: [isNotConnectedGuard],
    loadComponent: () => import('./pages/register-page/register-page').then((c) => c.RegisterPage),
  },
];
