import { Routes } from '@angular/router';
import { isConnectedGuard, isNotConnectedGuard } from '@core/guards';

export const routes: Routes = [
    {
        path: '',
        loadComponent: () =>
            import('./pages/home-page/home-page').then((c) => c.Home),
    },
];
