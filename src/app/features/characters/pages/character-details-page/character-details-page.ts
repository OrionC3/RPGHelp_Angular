import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { CharactersDetailsDto } from '@core/models/characters-details-dto.models';
import { CharatersService } from '@core/services/charaters.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-character-details-page',
    imports: [RouterLink, TranslatePipe],
    templateUrl: './character-details-page.html',
    styleUrl: './character-details-page.scss',
})
export class CharacterDetailsPage {
    private readonly _charactersService = inject(CharatersService);
    private readonly _activactedRoute = inject(ActivatedRoute);
    characters: CharactersDetailsDto | null = null;
    charactersSubscription: Subscription | null = null;
    charactersError: string | null = null;

    ngOnInit() {
        this._activactedRoute.params.subscribe({
            next: (params) => {
                this.charactersSubscription = this._charactersService
                    .getCharactersById(+params['id'])
                    .subscribe({
                        next: (data) => {
                            console.log(data);
                            this.characters = data;
                            console.log(this.characters);
                        },
                        error: (err) => {
                            console.error(err);
                            this.charactersError = err.message;
                        },
                    });
            },
        });
    }
}
