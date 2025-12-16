import { Component, inject, signal, WritableSignal } from '@angular/core';
import { Router } from '@angular/router';
import { CharactersIndexDto } from '@core/models/characters-index-dto.model';
import { CharatersService } from '@core/services/charaters.service';
import { TranslatePipe } from '@ngx-translate/core';
import { ConfirmModal } from '@components/modal/confirm-modal/confirm-modal';
import { Pagination } from '@components/layout/pagination/pagination';

@Component({
    selector: 'app-character-listing-page',
    imports: [TranslatePipe, ConfirmModal, Pagination],
    templateUrl: './character-listing-page.html',
    styleUrl: './character-listing-page.scss',
})
export class CharacterListingPage {
    private readonly _charactersService = inject(CharatersService);
    private readonly _router = inject(Router);
    count: number | null = null;
    currentPage: number = 1;
    pageSize: number = 10;

    characters: CharactersIndexDto[] = [];
    charactersError: string | null = null;
    public elementIdToConfirm: WritableSignal<number | null> = signal(null);

    ngOnInit(): void {
        this._charactersService
            .getCharacters()
            .then((data) => {
                this.characters = data.data;
                this.count = data.count;
            })
            .catch((err) => {
                console.error(err);
                this.charactersError = err.message;
            });
    }

    onClickDetails(id: string | number) {
        this._router.navigate(['/', 'characters', id]);
    }

    onClickUpdate(id: string | number) {
        this._router.navigate(['/', 'characters', id, 'update']);
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
            //this._router.navigate(['/characters', id, 'delete']);
            this._charactersService
                .deleteCharactersById(id)
                .then(() => {
                    const currentUrl = this._router.url;
                    this._router
                        .navigateByUrl('/', { skipLocationChange: true })
                        .then(() => {
                            this._router.navigateByUrl(currentUrl);
                        });
                })
                .catch((err) => {
                    console.error(err);
                    this.charactersError = err.message;
                });
        } else {
            console.log('Action annulée ou ID non défini.');
        }
        // Cache la modale en réinitialisant l'ID
        this.elementIdToConfirm.set(null);
    }

    futurPage(next: number) {
        this._charactersService
            .getCharacters(next - 1)
            .then((data) => {
                this.characters = data.data;
                this.count = data.count;
            })
            .catch((err) => {
                console.error(err);
                this.charactersError = err.message;
            });
    }

    addCharacters() {
        this._router.navigate(['/', 'characters', 'create']);
    }
}
