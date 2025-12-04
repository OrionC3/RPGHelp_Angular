import { Routes } from '@angular/router';

export const routes: Routes = [
  {
    path: '404',
    loadComponent: () =>
      import('./pages/not-found-page/not-found-page').then((c) => c.NotFoundPage),
  },
];
