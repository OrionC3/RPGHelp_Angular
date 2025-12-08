import { Routes } from "@angular/router";
import { adminGuard, isConnectedGuard } from "@core/guards";

export const routes: Routes = [
    {
        path: '',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/campaign-listing-page/campaign-listing-page').then((c) => c.CampaignListingPage),
    },
    {
        path:'add',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/campaign-form-page/campaign-form-page').then((c) => c.CampaignFormPage),
    },
    {
        path:':id',
        canActivate: [isConnectedGuard],
        loadComponent: () =>
            import('./pages/campaign-details-page/campaign-details-page').then((c) => c.CampaignDetailsPage),
    },
];