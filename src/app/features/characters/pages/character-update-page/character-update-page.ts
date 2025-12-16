import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { InputTextAutocomplete } from '@components/form/input-text-autocomplete/input-text-autocomplete';
import { CharactersDetailsDto } from '@core/models/characters-details-dto.models';
import { CharactersFormDto } from '@core/models/characters-form-dto.model';
import { RaceIndexDto } from '@core/models/race-index-dto.model';
import { CharatersService } from '@core/services/charaters.service';
import { RaceService } from '@core/services/race.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-character-update-page',
    imports: [ReactiveFormsModule, TranslatePipe],
    templateUrl: './character-update-page.html',
    styleUrl: './character-update-page.scss',
})
export class CharacterUpdatePage {
    private readonly _fb = inject(FormBuilder);
    private readonly _charactersService = inject(CharatersService);
    private readonly _router = inject(Router);
    private readonly _raceService = inject(RaceService);
    private readonly _activatedRoute = inject(ActivatedRoute);

    raceId: number = 0;
    races: RaceIndexDto[] = [];

    characterId: number = 0;
    character: CharactersDetailsDto | null = null;
    userId: number = 0;

    charactersForm = this._fb.group({
        name: ['', [Validators.required, Validators.maxLength(20)]],
        pvCurrent: [0, [Validators.required]],
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
        userId: [0],
    });

    onSubmit() {
        if (this.charactersForm.valid) {
            console.log(this.userId);

            const characters: CharactersFormDto = {
                name: this.charactersForm.value.name!,
                pvMax: this.charactersForm.value.pvMax!,
                pvCurrent: this.charactersForm.value.pvCurrent!,
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
                raceId: this.raceId,
                userId: this.userId,
            };
            this._charactersService
                .updateCharacter(this.characterId, characters)
                .then((data) => {
                    //traitement
                    this._router.navigate(['/', 'characters']);
                })
                .catch((err) => {
                    console.error(err);
                });
        } else {
            console.log('formulaire invalide...');
        }
    }

    ngOnInit(): void {
        this._activatedRoute.params.subscribe({
            next: (params) => {
                this.characterId = +params['id'];

                // todo recupéré les info
                this._charactersService
                    .getCharactersById(this.characterId)
                    .then((data) => {
                        this.character = data;
                        this.charactersForm.patchValue({
                            // Les clés doivent correspondre aux noms des formControlName
                            name: this.character.name,
                            pvCurrent: this.character.pvCurrent,
                            pvMax: this.character.pvMax,
                            strength: this.character.strength,
                            dexterity: this.character.dexterity,
                            constitution: this.character.constitution,
                            intelligence: this.character.intelligence,
                            wisdom: this.character.wisdom,
                            charisma: this.character.charisma,
                            defence: this.character.defence,
                            initiative: this.character.initiative,
                            baseAttackBonus: this.character.baseAttackBonus,
                            fortitudeSave: this.character.fortitudeSave,
                            reflexeSave: this.character.reflexeSave,
                            willpowerSave: this.character.willpowerSave,
                            level: this.character.level,
                            xp: this.character.xp,
                            speed: this.character.speed,
                        });
                        this.userId = this.character.userId;
                        this.raceId = this.character.raceId;
                    })
                    .catch((err) => {
                        console.error(err);
                    });
            },
        });
    }
}
