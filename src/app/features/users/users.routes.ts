import { Routes } from '@angular/router';
import { isConnectedGuard, isNotConnectedGuard } from '@core/guards';

export const routes: Routes = [
    {
        path: 'self',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/self-page/self-page').then((c) => c.SelfPage),
    },
];
