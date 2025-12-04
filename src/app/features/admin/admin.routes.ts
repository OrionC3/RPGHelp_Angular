import { Routes } from '@angular/router';

export const routes: Routes = [
    {
        path: 'user',
        loadChildren: () =>
            import('./users/admin.users.routes').then((r) => r.routes),
    },
];
