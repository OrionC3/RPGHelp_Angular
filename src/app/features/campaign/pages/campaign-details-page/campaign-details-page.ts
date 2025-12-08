import { Component, inject, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CampagnIndexDto } from '@core/models/campagn-index-dto.model';
import { CampaignDetailsDtoModel } from '@core/models/campaign-details-dto.model';
import { CampaignService } from '@core/services/campaign.service';
import { Subscription } from 'rxjs';

@Component({
  selector: 'app-campaign-details-page',
  imports: [RouterLink],
  templateUrl: './campaign-details-page.html',
  styleUrl: './campaign-details-page.scss',
})
export class CampaignDetailsPage implements OnInit {

  private readonly _campagnService = inject(CampaignService);
  private readonly _router = inject(Router);
totalCampaigns: number = 0;
campaign: CampaignDetailsDtoModel | null = null;
campaignSubscription: Subscription | null = null;
userError: string | null = null;

  campaignId!: string;

  constructor(private route: ActivatedRoute) {}
  
ngOnInit(): void {
  // Récupération de la campagne actuelle
  this.campaignSubscription = this.route.paramMap.subscribe(params => {
    const id = params.get('id');
    if (!id) return;
    this.campaignId = id;

    // Appel pour récupérer la campagne par ID
    this._campagnService.getCampaignById(id).subscribe({
      next: (data) => this.campaign = data,
      error: (err) => this.userError = err.message
    });
  });

  // Récupérer la liste complète pour connaître le nombre total
  this._campagnService.getCampaigns().subscribe({
    next: (listData) => {
      this.totalCampaigns = listData.data.length;
    },
    error: (err) => console.error("Impossible de récupérer le total de campagnes", err)
  });
}
 
onNextCampaign() {
  const nextId = Number(this.campaignId) + 1;
  if(nextId > this.totalCampaigns) {
    console.log("C'est la dernière campagne !");
    return; // on ne navigue pas
  }
  this._router.navigate(['/campaign', nextId]);
}
}