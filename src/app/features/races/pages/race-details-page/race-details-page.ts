import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { RaceDetailsDto } from '@core/models/race-details-dto.model';
import { RaceService } from '@core/services/race.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-race-details-page',
    imports: [TranslatePipe],
    templateUrl: './race-details-page.html',
    styleUrl: './race-details-page.scss',
})
export class RaceDetailsPage {
    private readonly _raceService = inject(RaceService);
    private readonly _activactedRoute = inject(ActivatedRoute);
    race: RaceDetailsDto | null = null;
    raceSubscription: Subscription | null = null;
    raceError: string | null = null;

    ngOnInit() {
        this._activactedRoute.params.subscribe({
            next: (params) => {
                this.raceSubscription = this._raceService
                    .getRaceById(+params['id'])
                    .subscribe({
                        next: (data) => {
                            console.log(data);
                            this.race = data;
                            console.log(this.race);
                        },
                        error: (err) => {
                            console.error(err);
                            this.raceError = err.message;
                        },
                    });
            },
        });
    }
}
