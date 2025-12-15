import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CampagnIndexDto } from '@core/models/campagn-index-dto.model';
import { CampaignService } from '@core/services/campaign.service';
import { LoadingService } from '@core/services/loading-service';
import { TranslatePipe } from '@ngx-translate/core';
import { lastValueFrom, Subscription } from 'rxjs';

@Component({
  selector: 'app-campaign-listing-page',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './campaign-listing-page.html',
  styleUrl: './campaign-listing-page.scss',
})
export class CampaignListingPage implements OnInit, OnDestroy {
  
  private readonly _campaignService = inject(CampaignService);
  private readonly _loading = inject(LoadingService);
  
  campaign: CampagnIndexDto[] = [];
  campaignSubsciption: Subscription | null = null;
  userError: string | null = null;

async ngOnInit(): Promise<void> {
  this._loading.show();
  const start = Date.now();

  try {
    // Convertit l'Observable en Promise
    const data = await lastValueFrom(this._campaignService.getCampaigns());
    this.campaign = data.data;

  } catch (err: any) {
    console.error(err);
    this.userError = err.message || 'Erreur lors du chargement';

  } finally {
    // Spinner minimum 2 secondes
    const elapsed = Date.now() - start;
    const remaining = 2000 - elapsed;
    if (remaining > 0) {
      await new Promise(res => setTimeout(res, remaining));
    }
    this._loading.hide();
  }
}


  ngOnDestroy(): void {
    this.campaignSubsciption?.unsubscribe();
  }
}
