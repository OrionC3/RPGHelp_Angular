import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { CampagnIndexDto } from '@core/models/campagn-index-dto.model';
import { CampaignService } from '@core/services/campaign.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-campaign-listing-page',
  imports: [RouterModule, TranslatePipe],
  templateUrl: './campaign-listing-page.html',
  styleUrl: './campaign-listing-page.scss',
})
export class CampaignListingPage implements OnInit, OnDestroy {
  
  private readonly _campaignService = inject(CampaignService);
  
  campaign: CampagnIndexDto[] = [];
  campaignSubsciption: Subscription | null = null;
  userError: string | null = null;

  ngOnInit(): void {
    this.campaignSubsciption = this._campaignService.getCampaigns().subscribe({
      next: (data) => {
        console.log(data);
        this.campaign = data.data;
      },
      error: (err) => {
        console.error(err);
        this.userError = err.message;
      },
    });
  }

  ngOnDestroy(): void {
    this.campaignSubsciption?.unsubscribe();
  }
}
