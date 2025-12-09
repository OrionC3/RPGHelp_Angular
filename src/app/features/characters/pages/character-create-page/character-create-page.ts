import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { CharactersFormDto } from '@core/models/characters-form-dto.model';
import { CharatersService } from '@core/services/charaters.service';
import { RaceService } from '@core/services/race.service';
import { TranslatePipe } from '@ngx-translate/core';
import { RaceIndexDto } from '@core/models/race-index-dto.model';
import { InputDatalist } from '@components/common/input-datalist/input-datalist';

@Component({
    selector: 'app-character-create-page',
    imports: [ReactiveFormsModule, TranslatePipe, InputDatalist],
    templateUrl: './character-create-page.html',
    styleUrl: './character-create-page.scss',
})
export class CharacterCreatePage {
    private readonly _fb = inject(FormBuilder);
    private readonly _charactersService = inject(CharatersService);
    private readonly _router = inject(Router);
    private readonly _raceService = inject(RaceService);

    idRace: number = 0;
    races: RaceIndexDto[] = [];

    charactersForm = this._fb.group({
        name: ['', [Validators.required, Validators.maxLength(20)]],
        pvMax: [0, [Validators.required, Validators.min(1)]],
        strength: [0, [Validators.required, Validators.min(1)]],
        dexterity: [0, [Validators.required, Validators.min(1)]],
        constitution: [0, [Validators.required, Validators.min(1)]],
        intelligence: [0, [Validators.required, Validators.min(1)]],
        wisdom: [0, [Validators.required, Validators.min(1)]],
        charisma: [0, [Validators.required, Validators.min(1)]],
        defence: [0, [Validators.required, Validators.min(1)]],
        initiative: [0, [Validators.required, Validators.min(1)]],
        baseAttackBonus: [0, [Validators.required, Validators.min(1)]],
        fortitudeSave: [0, [Validators.required, Validators.min(1)]],
        reflexeSave: [0, [Validators.required, Validators.min(1)]],
        willpowerSave: [0, [Validators.required, Validators.min(1)]],
        level: [0, [Validators.required, Validators.min(0)]],
        xp: [0, [Validators.required, Validators.min(0)]],
        speed: [0, [Validators.required, Validators.min(1)]],
    });

    onSubmit() {
        console.log(this.idRace);

        if (this.charactersForm.valid && this.idRace > 0) {
            const characters: CharactersFormDto = {
                name: this.charactersForm.value.name!,
                idRace: this.idRace!,
                pvMax: this.charactersForm.value.pvMax!,
                pvCurrent: this.charactersForm.value.pvMax!,
                strength: this.charactersForm.value.strength!,
                dexterity: this.charactersForm.value.dexterity!,
                constitution: this.charactersForm.value.constitution!,
                intelligence: this.charactersForm.value.intelligence!,
                wisdom: this.charactersForm.value.wisdom!,
                charisma: this.charactersForm.value.charisma!,
                defence: this.charactersForm.value.defence!,
                initiative: this.charactersForm.value.initiative!,
                baseAttackBonus: this.charactersForm.value.baseAttackBonus!,
                fortitudeSave: this.charactersForm.value.fortitudeSave!,
                reflexeSave: this.charactersForm.value.reflexeSave!,
                willpowerSave: this.charactersForm.value.willpowerSave!,
                level: this.charactersForm.value.level!,
                xp: this.charactersForm.value.xp!,
                speed: this.charactersForm.value.speed!,
            };
            this._charactersService.createCharacter(characters).subscribe({
                next: (data) => {
                    //traitement
                    this._router.navigate(['/', 'characters']);
                },
                error: (err) => {
                    console.error(err);
                },
            });
        } else {
            console.log('formulaire invalide...');
        }
    }

    onSearchRaces(search: string) {
        this._raceService.getRacesByName(search).subscribe({
            next: (data) => {
                this.races = data.data;
            },
            error: (err) => {
                console.error('Erreur de chargement des realisateurs:', err);
            },
        });
    }
    idSelected(id: string | number | null) {
        if (id === null) {
            this.idRace = 0; // or set to a default value like 0
            return;
        }
        console.log('selected : ' + id);
        this.idRace = parseInt(String(id), 10);
        console.log(this.idRace);
    }
}
