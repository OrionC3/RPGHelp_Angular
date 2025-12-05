import {
    Component,
    input,
    output,
    signal,
    WritableSignal,
} from '@angular/core';
import { ConfirmModal } from '@components/modal/confirm-modal/confirm-modal';
import { ColumnDefinition } from '@core/models/column-definition.models';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-listing-table-admin',
    imports: [ConfirmModal, TranslatePipe],
    templateUrl: './listing-table-admin.html',
    styleUrl: './listing-table-admin.scss',
})
export class ListingTableAdmin {
    elements = input.required<
        {
            id: string | number;
            [key: string]: any;
        }[]
    >();

    colums = input<ColumnDefinition[]>();
    public elementIdToConfirm: WritableSignal<number | null> = signal(null);

    clickDetails = output<string | number>();
    clickUpdate = output<string | number>();
    clickDelete = output<string | number>();
    clickNext = output<number>();
    clickPrevious = output<number>();

    currentPage = input<number>(1);
    count = input<number>();

    onDetails(id: string | number) {
        this.clickDetails.emit(id);
    }

    onUpdate(id: string | number) {
        this.clickUpdate.emit(id);
    }

    onDelete(id: string | number) {
        this.elementIdToConfirm.set(+id);
        //this.clickDelete.emit(id);
    }

    onModalAction(isConfirmed: boolean) {
        const id = this.elementIdToConfirm();
        if (isConfirmed && id !== null) {
            console.log(`Suppression confirmée pour l'élément ID: ${id}`);
            // Logique de suppression ici
            this.clickDelete.emit(id);
        } else {
            console.log('Action annulée ou ID non défini.');
        }
        // Cache la modale en réinitialisant l'ID
        this.elementIdToConfirm.set(null);
    }

    onPrevious(page: number) {
        this.clickPrevious.emit(page);
    }
    onNext(page: number) {
        this.clickNext.emit(page);
    }
}
