import { Component, inject } from '@angular/core';
import {
  FormBuilder,
  FormControl,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { Router } from '@angular/router';
import { CampaignService } from '@core/services/campaign.service';
import { LoadingService } from '@core/services/loading-service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-campaign-form-page',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './campaign-form-page.html',
  styleUrl: './campaign-form-page.scss',
})
export class CampaignFormPage {
  private readonly fb = inject(FormBuilder);
  private readonly campaignService = inject(CampaignService);
  private readonly loadingService = inject(LoadingService);
  private readonly router = inject(Router);

  loading = false;
  campaignError: string | null = null;

  name = new FormControl('', {
    nonNullable: true,
    validators: [
      Validators.required,
      Validators.minLength(5),
      Validators.maxLength(100),
    ],
  });

  campaignForm = this.fb.group({
    name: this.name,
  });

  get nameLengthMessage() {
    return {
      minLength: this.name.errors?.['minlength']?.requiredLength ?? 5,
      maxLength: this.name.errors?.['maxlength']?.requiredLength ?? 100,
    };
  }

  async onSubmit(): Promise<void> {
    if (this.campaignForm.invalid) {
      this.campaignForm.markAllAsTouched();
      return;
    }

    const payload = {
      name: this.name.value,
    };

    console.log('CREATE CAMPAIGN PAYLOAD', payload);

    this.loading = true;
    this.loadingService.show();

    try {
      await this.campaignService.add(payload);
      this.router.navigate(['/campaign']);
    } catch (err: any) {
      console.error(err);
      this.campaignError =
        err?.error?.message ?? 'Erreur lors de la création de la campagne';
    } finally {
      this.loading = false;
      this.loadingService.hide();
    }
  }
}
