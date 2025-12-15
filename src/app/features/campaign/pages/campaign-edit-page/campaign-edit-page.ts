import { Component, OnInit, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import {
    FormControl,
    FormGroup,
    ReactiveFormsModule,
    Validators,
} from '@angular/forms';
import { CampaignService } from '@core/services/campaign.service';
import { CampaignFormDtoModel } from '@core/models/campaign-form-dto.model';
import { TranslatePipe } from '@ngx-translate/core';
import { LoadingService } from '@core/services/loading-service';
import { lastValueFrom } from 'rxjs';

@Component({
    selector: 'app-campaign-edit-page',
    imports: [TranslatePipe, ReactiveFormsModule],
    templateUrl: './campaign-edit-page.html',
    styleUrl: './campaign-edit-page.scss',
})
export class CampaignEditPage implements OnInit {
    private readonly _campaignService = inject(CampaignService);
    private readonly _route = inject(ActivatedRoute);
    private readonly _loading = inject(LoadingService);
    private readonly _router = inject(Router);

    campaignId!: number;

    form = new FormGroup({
        name: new FormControl('', [
            Validators.required,
            Validators.minLength(5),
            Validators.maxLength(100),
        ]),
    });

    ngOnInit(): void {
        const id = this._route.snapshot.paramMap.get('id');
        if (!id) return;

        this.campaignId = Number(id);

        this._campaignService
            .getCampaignById(this.campaignId)
            .then((data) => this.form.patchValue(data))
            .catch(() => console.error('Erreur chargement campagne'));
    }

    async onSubmit(): Promise<void> {
        // Vérifie la validité du formulaire
        if (this.form.invalid) return;

        const updatedCampaign = this.form.value as CampaignFormDtoModel;

        // ⏳ Affiche le spinner
        this._loading.show();
        const start = Date.now();

        try {
            // Attente de la mise à jour via l'Observable transformé en Promise
            await lastValueFrom(
                this._campaignService.updateCampaign(
                    this.campaignId,
                    updatedCampaign,
                ),
            );

            // Redirection après succès
            this._router.navigate(['/campaign', this.campaignId]);
        } catch (err) {
            console.error('Impossible de mettre à jour la campagne', err);
        } finally {
            // Masque le spinner dans tous les cas
            const elapsed = Date.now() - start;
            const remaining = 2000 - elapsed;

            if (remaining > 0) {
                await new Promise((res) => setTimeout(res, remaining));
            }

            this._loading.hide();
        }
    }

    onCancel() {
        this._router.navigate(['/campaign', this.campaignId]);
    }
}
