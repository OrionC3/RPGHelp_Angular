import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CampaignDetailsDtoModel } from '@core/models/campaign-details-dto.model';
import { CampaignService } from '@core/services/campaign.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-campaign-details-page',
  imports: [RouterLink, TranslatePipe],
  templateUrl: './campaign-details-page.html',
  styleUrls: ['./campaign-details-page.scss'],
})
export class CampaignDetailsPage implements OnInit, OnDestroy {

  private readonly _campaignService = inject(CampaignService);
  private readonly _router = inject(Router);

  campaign: CampaignDetailsDtoModel | null = null;
  campaignSubscription!: Subscription;

  totalCampaigns = 0;
  campaignId!: string;

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.campaignSubscription = this.route.paramMap.subscribe(params => {
      const id = params.get('id');
      if (!id) return;

      this.campaignId = id;

      this._campaignService.getCampaignById(id).subscribe({
        next: (data) => this.campaign = data,
        error: (err) => console.error(err),
      });
    });

    this._campaignService.getCampaigns().subscribe({
      next: (list) => this.totalCampaigns = list.data.length,
      error: (err) => console.error(err),
    });
  }

  ngOnDestroy(): void {
    this.campaignSubscription?.unsubscribe();
  }

  onNextCampaign() {
    const nextId = Number(this.campaignId) + 1;
    if (nextId > this.totalCampaigns) return;
    this._router.navigate(['/campaign', nextId]);
  }

  deleteCampaign() {
    if (!this.campaign) return;

    this._campaignService.deleteCampaign(this.campaign.id).subscribe({
      next: () => {
        console.log('Campagne supprimée avec succès');
        this._router.navigate(['/campaign']);
      },
      error: (err) => console.error('Erreur suppression:', err),
    });
  }
  onEditCampaign() {
    this._router.navigate(['/campaign/edit', this.campaignId]);
  }

}
