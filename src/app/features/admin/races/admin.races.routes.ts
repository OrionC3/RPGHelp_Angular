import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/race-listing-page/race-listing-page').then(
                (c) => c.RaceListingPage,
            ),
    },
    {
        path: 'create',
        loadComponent: () =>
            import('./pages/race-create-page/race-create-page').then(
                (c) => c.RaceCreatePage,
            ),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/race-details-page/race-details-page').then(
                (c) => c.RaceDetailsPage,
            ),
    },
    {
        path: ':id/update',
        loadComponent: () =>
            import('./pages/race-update-page/race-update-page').then(
                (c) => c.RaceUpdatePage,
            ),
    },
];
