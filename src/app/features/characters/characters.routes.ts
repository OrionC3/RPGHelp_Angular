import { Routes } from '@angular/router';
import { isConnectedGuard, isNotConnectedGuard } from '@core/guards';

export const routes: Routes = [
    {
        path: '',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/character-listing-page/character-listing-page').then(
                (c) => c.CharacterListingPage,
            ),
    },
    {
        path: 'create',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/character-create-page/character-create-page').then(
                (c) => c.CharacterCreatePage,
            ),
    },
    {
        path: ':id',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/character-details-page/character-details-page').then(
                (c) => c.CharacterDetailsPage,
            ),
    },
    {
        path: ':id/update',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/character-update-page/character-update-page').then(
                (c) => c.CharacterUpdatePage,
            ),
    },
    {
        path: ':id/delete',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/character-delete-page/character-delete-page').then(
                (c) => c.CharacterDeletePage,
            ),
    },
];
