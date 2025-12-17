import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { Router, RouterModule, NavigationEnd } from '@angular/router';
import { CampagnIndexDto } from '@core/models/campagn-index-dto.model';
import { CampaignService } from '@core/services/campaign.service';
import { LoadingService } from '@core/services/loading-service';
import { TranslatePipe } from '@ngx-translate/core';
import { filter, lastValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-campaign-listing-page',
  standalone: true,
  imports: [RouterModule, TranslatePipe],
  templateUrl: './campaign-listing-page.html',
  styleUrl: './campaign-listing-page.scss',
})
export class CampaignListingPage implements OnInit, OnDestroy {

  private readonly campaignService = inject(CampaignService);
  private readonly loading = inject(LoadingService);
  private readonly router = inject(Router);

  campaign: CampagnIndexDto[] = [];
  userError: string | null = null;

  private routerSub!: Subscription;

  async ngOnInit(): Promise<void> {
    // 🔥 1️⃣ CHARGEMENT INITIAL (OBLIGATOIRE)
    await this.loadCampaigns();

    // 🔥 2️⃣ Recharge quand on revient sur la page
    this.routerSub = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.loadCampaigns();
      });
  }

  async loadCampaigns(): Promise<void> {
    this.loading.show();
    const start = Date.now();

    try {
      const response = await lastValueFrom(this.campaignService.getCampaigns());

      // 💡 protège si backend change
      this.campaign = response?.data ?? [];

    } catch (err: any) {
      console.error(err);
      this.userError = err.message || 'Erreur lors du chargement';

    } finally {
      const elapsed = Date.now() - start;
      const remaining = 2000 - elapsed;

      if (remaining > 0) {
        await new Promise(res => setTimeout(res, remaining));
      }

      this.loading.hide();
    }
  }

  ngOnDestroy(): void {
    this.routerSub?.unsubscribe();
  }
}
