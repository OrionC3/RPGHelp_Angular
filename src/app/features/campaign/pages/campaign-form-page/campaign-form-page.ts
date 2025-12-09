import { Component, inject } from '@angular/core';
import { FormBuilder, FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CampaignService } from '@core/services/campaign.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-campaign-form-page',
  imports: [TranslatePipe, ReactiveFormsModule],
  templateUrl: './campaign-form-page.html',
  styleUrl: './campaign-form-page.scss',
})
export class CampaignFormPage {
  private readonly _fb = inject(FormBuilder);
  private readonly _campagnService = inject(CampaignService);
  private readonly _router = inject(Router);

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

  onSubmit() {
    if(this.campaignForm.valid){
      this._campagnService
      .add({
        name: this.campaignForm.value.name!,
      })
      .then(() => {
        this._router.navigate(['/campaign']);
      })
      .catch((err) => {
        console.log(err);
        this.campaignError = err.message;
      });
    }
  }


}