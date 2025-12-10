import { Component, inject } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { RaceDetailsDto } from '@core/models/race-details-dto.model';
import { RaceService } from '@core/services/race.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-race-details-page',
    imports: [TranslatePipe, RouterLink],
    templateUrl: './race-details-page.html',
    styleUrl: './race-details-page.scss',
})
export class RaceDetailsPage {
    private readonly _raceService = inject(RaceService);
    private readonly _activactedRoute = inject(ActivatedRoute);
    race: RaceDetailsDto | null = null;
    raceError: string | null = null;

    ngOnInit() {
        this._activactedRoute.params.subscribe({
            next: (params) => {
                this._raceService
                    .getRaceById(+params['id'])
                    .then((data) => {
                        this.race = data;
                    })
                    .catch((err) => {
                        console.error(err);
                        this.raceError = err.message;
                    });
            },
        });
    }
}
