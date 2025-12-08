import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { RaceService } from '@core/services/race.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-race-delete-page',
    imports: [],
    templateUrl: './race-delete-page.html',
    styleUrl: './race-delete-page.scss',
})
export class RaceDeletePage {
    private readonly _raceService = inject(RaceService);
    private readonly _router = inject(Router);
    private readonly _activatedRoute = inject(ActivatedRoute);

    userId!: number;
    getUserSubscription: Subscription | null = null;
    ngOnInit(): void {
        this._activatedRoute.params.subscribe({
            next: (params) => {
                this.userId = +params['id'];

                // todo recupéré les info
                this.getUserSubscription = this._raceService
                    .deleteRaceById(this.userId)
                    .subscribe({
                        next: () => {
                            this._router.navigate(['/', 'races']);
                        },
                        error: (err) => {
                            console.error(err);
                        },
                    });
            },
        });
    }

    ngOnDestroy(): void {
        this.getUserSubscription?.unsubscribe();
    }
}
