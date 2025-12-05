import { Component, input, output } from '@angular/core';
import { ColumnDefinition } from '@core/models/column-definition.models';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-listing-table',
    imports: [TranslatePipe],
    templateUrl: './listing-table.html',
    styleUrl: './listing-table.scss',
})
export class ListingTable {
    elements = input.required<
        {
            id: string | number;
            [key: string]: any;
        }[]
    >();
    columns = input.required<ColumnDefinition[]>();

    clickDetails = output<string | number>();

    onDetails(id: string | number) {
        this.clickDetails.emit(id);
    }
}
