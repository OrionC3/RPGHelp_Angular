import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CampaignService } from '@core/services/campaign.service';
import { CampaignFormDtoModel } from '@core/models/campaign-form-dto.model';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-campaign-edit-page',
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './campaign-edit-page.html',
  styleUrl: './campaign-edit-page.scss',
})
export class CampaignEditPage implements OnInit {

  private readonly _campaignService = inject(CampaignService);
  private readonly _route = inject(ActivatedRoute);
  private readonly _router = inject(Router);

  campaignId!: number;

  form = new FormGroup({
    name: new FormControl('', [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ])
  });

  ngOnInit(): void {
    const id = this._route.snapshot.paramMap.get('id');
    if (!id) return;

    this.campaignId = Number(id);

    this._campaignService.getCampaignById(this.campaignId).subscribe({
      next: (data) => this.form.patchValue(data),
      error: () => console.error("Erreur chargement campagne")
    });
  }

  onSubmit() {
  if (this.form.invalid) return;

  const updatedCampaign = this.form.value as CampaignFormDtoModel;

  this._campaignService.updateCampaign(this.campaignId, updatedCampaign)
    .subscribe({
      next: () => this._router.navigate(['/campaign', this.campaignId]),
      error: () => console.error('Impossible de mettre à jour la campagne')
    });
}


  onCancel() {
    this._router.navigate(['/campaign', this.campaignId]);
  }
}
