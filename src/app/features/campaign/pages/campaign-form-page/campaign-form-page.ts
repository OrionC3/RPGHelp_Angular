import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CampaignService } from '@core/services/campaign.service';
import { LoadingService } from '@core/services/loading-service';
import { TranslatePipe } from '@ngx-translate/core';
import { timer } from 'rxjs';

@Component({
  selector: 'app-campaign-form-page',
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './campaign-form-page.html',
  styleUrl: './campaign-form-page.scss',
})
export class CampaignFormPage {
  private readonly _fb = inject(FormBuilder);
  private readonly _campagnService = inject(CampaignService);
  private readonly _loading = inject(LoadingService);
  private readonly _router = inject(Router);

  loading: boolean = false;

get nameLengthMessage() {
  return {
    minLength: this.name.errors?.['minlength']?.requiredLength || 5,
    maxLength: this.name.errors?.['maxlength']?.requiredLength || 100,
  };
}

  name = new FormControl('', [
    Validators.required,
    Validators.minLength(5),
    Validators.maxLength(100),
  ]);


  campaignForm = this._fb.group({
    name: this.name,
  });

  campaignError = '';

async onSubmit(): Promise<void> {
  if (this.campaignForm.invalid) return;

  const newCampaign = {
    name: this.campaignForm.value.name!
  };

  // ⏳ Affiche le spinner global
  this._loading.show();
  const start = Date.now();


  try {
    // Convertit la Promise en await direct
    await this._campagnService.add(newCampaign);

    // Redirection après succès
    this._router.navigate(['/campaign']);

  } catch (err: any) {
    console.error('Erreur lors de la création de la campagne', err);
    this.campaignError = err.message || 'Une erreur est survenue';

  } finally {
    const elapsed = Date.now() - start;
    const remaining = 2000 - elapsed;

    if (remaining > 0) {
      await new Promise(res => setTimeout(res, remaining));
    }

    this._loading.hide();

  }
}

}