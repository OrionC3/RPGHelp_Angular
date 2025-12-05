import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/user-listing-page/user-listing-page').then(
                (c) => c.UserListingPage,
            ),
    },
    {
        path: ':id',
        loadComponent: () =>
            import('./pages/user-details-page/user-details-page').then(
                (c) => c.UserDetailsPage,
            ),
    },
    {
        path: ':id/delete',
        loadComponent: () =>
            import('./pages/user-delete-page/user-delete-page').then(
                (c) => c.UserDeletePage,
            ),
    },
];
