import { Routes } from '@angular/router';
import { isConnectedGuard, isNotConnectedGuard } from '@core/guards';

export const routes: Routes = [
    {
        path: '',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/race-listing-page/race-listing-page').then(
                (c) => c.RaceListingPage,
            ),
    },
    {
        path: ':id',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/race-details-page/race-details-page').then(
                (c) => c.RaceDetailsPage,
            ),
    },
    {
        path: 'create',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/race-create-page/race-create-page').then(
                (c) => c.RaceCreatePage,
            ),
    },
    {
        path: ':id/update',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/race-update-page/race-update-page').then(
                (c) => c.RaceUpdatePage,
            ),
    },
    {
        path: ':id/delete',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/race-delete-page/race-delete-page').then(
                (c) => c.RaceDeletePage,
            ),
    },
];
