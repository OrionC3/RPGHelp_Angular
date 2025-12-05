import { Routes } from '@angular/router';
import { adminGuard } from '@core/guards';
export const routes: Routes = [
    {
        path: 'auth',
        loadChildren: () =>
            import('./features/auth/auth.routes').then((r) => r.routes),
    },
    {
        path: 'users',
        loadChildren: () =>
            import('./features/users/users.routes').then((r) => r.routes),
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
        path: 'error',
        loadChildren: () =>
            import('./features/error/error.routes').then((r) => r.routes),
    },
    {
        path: '**',
        redirectTo: '/error/404',
    },
];
