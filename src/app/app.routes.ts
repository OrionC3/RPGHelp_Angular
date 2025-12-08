import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards';
export const routes: Routes = [
    {
        path: '',
        loadChildren: () =>
            import('./features/home/home.routes').then((r) => r.routes),
    },
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((r) => r.routes),
    },
    {
        path: 'users',
        loadChildren: () =>
            import('./features/users/users.routes').then((r) => r.routes),
    },    {
        path: 'campaign',
        loadChildren: () =>
            import('./features/campaign/campaign.routes').then((r) => r.routes),
    },
    {
        path: 'admin',
        canActivateChild: [adminGuard],
        loadChildren: () =>
            import('./features/admin/admin.routes').then((r) => r.routes),
    },
    {
        path: 'characters',
        loadChildren: () =>
            import('./features/characters/characters.routes').then(
                (r) => r.routes,
            ),
    },
    {
        path: 'races',
        loadChildren: () =>
            import('./features/races/races.routes').then((r) => r.routes),
    },
    {
        path: 'error',
        loadChildren: () =>
            import('./features/error/error.routes').then((r) => r.routes),
    },
    {
        path: '**',
        redirectTo: '/error/404',
    },
];
