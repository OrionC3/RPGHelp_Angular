import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { RaceDetailsDto } from '@core/models/race-details-dto.model';
import { RaceFormDto } from '@core/models/race-form-dto.model';
import { RaceService } from '@core/services/race.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-race-create-page',
    imports: [ReactiveFormsModule, TranslatePipe],
    templateUrl: './race-create-page.html',
    styleUrl: './race-create-page.scss',
})
export class RaceCreatePage {
    private readonly _fb = inject(FormBuilder);
    private readonly _raceService = inject(RaceService);
    private readonly _router = inject(Router);

    Stat = [
        'Strength',
        'Dexterity',
        'Constitution',
        'Intelligence',
        'Wisdom',
        'Charisma',
    ];

    raceForm = this._fb.group({
        name: ['', [Validators.required]],
        travelSpeed: [0, [Validators.required]],
        bonusName: ['', [Validators.required]],
        bonusValue: [0, [Validators.required]],
        malusName: ['', [Validators.required]],
        malusValue: [0, [Validators.required]],
    });

    onSubmit() {
        console.log(this.raceForm.value);

        if (this.raceForm.valid) {
            const race: RaceFormDto = {
                name: this.raceForm.value.name!,
                travelSpeed: this.raceForm.value.travelSpeed!,
                bonusRacialFormDto: {
                    bonusName: this.raceForm.value.bonusName!,
                    bonusValue: this.raceForm.value.bonusValue!,
                    malusName: this.raceForm.value.malusName!,
                    malusValue: this.raceForm.value.malusValue!,
                },
            };
            this._raceService.createRace(race).subscribe({
                next: (data) => {
                    //traitement
                    this._router.navigate(['/', 'races']);
                },
                error: (err) => {
                    console.error(err);
                },
            });
        } else {
            console.log('formulaire invalide...');
        }
    }
}
