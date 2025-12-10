import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { RaceIndexDto } from '@core/models/race-index-dto.model';
import { TranslatePipe } from '@ngx-translate/core';
import { ConfirmModal } from '@components/modal/confirm-modal/confirm-modal';
import { RaceService } from '@core/services/race.service';
import { Pagination } from '@components/layout/pagination/pagination';

@Component({
    selector: 'app-race-listing-page',
    imports: [Pagination, TranslatePipe, ConfirmModal],
    templateUrl: './race-listing-page.html',
    styleUrl: './race-listing-page.scss',
})
export class RaceListingPage {
    private readonly _racesService = inject(RaceService);
    private readonly _router = inject(Router);
    count: number | null = null;
    currentPage: number = 1;
    pageSize: number = 10;
    races: RaceIndexDto[] = [];
    racesError: string | null = null;
    public elementIdToConfirm: WritableSignal<number | null> = signal(null);

    ngOnInit(): void {
        this._racesService
            .getRaces()
            .then((data) => {
                this.races = data.data;
                this.count = data.count;
            })
            .catch((err) => {
                console.error(err);
                this.racesError = err.message;
            });
    }

    onClickDetails(id: string | number) {
        this._router.navigate(['/', 'admin', 'races', id]);
    }

    onClickUpdate(id: string | number) {
        this._router.navigate(['/', 'admin', 'races', id, 'update']);
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
            this._racesService
                .deleteRaceById(id)
                .then(() => {
                    // redirigé
                    const currentUrl = this._router.url;
                    this._router
                        .navigateByUrl('/', { skipLocationChange: true })
                        .then(() => {
                            this._router.navigateByUrl(currentUrl);
                        });
                })
                .catch((err) => {
                    console.error(err);
                    this.racesError = err.message;
                });
        } else {
            console.log('Action annulée ou ID non défini.');
        }
        // Cache la modale en réinitialisant l'ID
        this.elementIdToConfirm.set(null);
    }

    addRace() {
        this._router.navigate(['/', 'admin', 'races', 'create']);
    }

    futurPage(next: number) {
        this._racesService
            .getRaces(next - 1)
            .then((data) => {
                this.races = data.data;
                this.count = data.count;
            })
            .catch((err) => {
                console.error(err);
                this.racesError = err.message;
            });
    }
}
