import {
    Component,
    inject,
    output,
    signal,
    WritableSignal,
} from '@angular/core';
import { Router } from '@angular/router';
import { CharactersIndexDto } from '@core/models/characters-index-dto.model';
import { CharatersService } from '@core/services/charaters.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
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
    charactersSubscription: Subscription | null = null;
    charactersError: string | null = null;
    public elementIdToConfirm: WritableSignal<number | null> = signal(null);

    ngOnInit(): void {
        this.charactersSubscription = this._charactersService
            .getCharacters()
            .subscribe({
                next: (data) => {
                    this.characters = data.data;
                    this.count = data.count;
                },
                error: (err) => {
                    console.error(err);
                    this.charactersError = err.message;
                },
            });
    }

    ngOnDestroy(): void {
        this.charactersSubscription?.unsubscribe();
    }

    onClickDetails(id: string | number) {
        this._router.navigate(['/', 'characters', id]);
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
            this._router.navigate(['/characters', id, 'delete']);
        } else {
            console.log('Action annulée ou ID non défini.');
        }
        // Cache la modale en réinitialisant l'ID
        this.elementIdToConfirm.set(null);
    }

    futurPage(next: number) {
        this.charactersSubscription = this._charactersService
            .getCharacters(next - 1)
            .subscribe({
                next: (data) => {
                    this.characters = data.data;
                    this.count = data.count;
                },
                error: (err) => {
                    console.error(err);
                    this.charactersError = err.message;
                },
            });
    }

    addCharacters() {
        this._router.navigate(['/', 'characters', 'create']);
    }
}
