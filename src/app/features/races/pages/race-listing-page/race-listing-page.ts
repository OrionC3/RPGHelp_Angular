import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { RaceIndexDto } from '@core/models/race-index-dto.model';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ConfirmModal } from '@components/modal/confirm-modal/confirm-modal';
import { RaceService } from '@core/services/race.service';

@Component({
    selector: 'app-race-listing-page',
    imports: [TranslatePipe, ConfirmModal, RouterLink],
    templateUrl: './race-listing-page.html',
    styleUrl: './race-listing-page.scss',
})
export class RaceListingPage {
    private readonly _racesService = inject(RaceService);
    private readonly _router = inject(Router);
    count: number | null = null;
    races: RaceIndexDto[] = [];
    racesSubscription: Subscription | null = null;
    racesError: string | null = null;
    public elementIdToConfirm: WritableSignal<number | null> = signal(null);

    ngOnInit(): void {
        this.racesSubscription = this._racesService.getRaces().subscribe({
            next: (data) => {
                console.log(data);
                this.races = data.data;
            },
            error: (err) => {
                console.error(err);
                this.racesError = err.message;
            },
        });
    }

    ngOnDestroy(): void {
        this.racesSubscription?.unsubscribe();
    }

    onClickDetails(id: string | number) {
        this._router.navigate(['/', 'races', id]);
    }

    onClickDelete(id: string | number) {
        //this._router.navigate(['/characters', id, 'delete']);
        this.elementIdToConfirm.set(+id);
    }

    onModalAction(isConfirmed: boolean) {
        const id = this.elementIdToConfirm();
        if (isConfirmed && id !== null) {
            console.log(`Suppression confirmée pour l'élément ID: ${id}`);
            // Logique de suppression ici
            this._router.navigate(['/races', id, 'delete']);
        } else {
            console.log('Action annulée ou ID non défini.');
        }
        // Cache la modale en réinitialisant l'ID
        this.elementIdToConfirm.set(null);
    }

    addRace() {
        this._router.navigate(['/', 'races', 'create']);
    }
}
