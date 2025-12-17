import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserListing } from '@core/models/user-listing.models';
import { UserService } from '@core/services/user.service';
import { TranslatePipe } from '@ngx-translate/core';

import { ListingTableAdmin } from '@components/common/listing-table-admin/listing-table-admin';
import { ColumnDefinition } from '@core/models/column-definition.models';
import { Pagination } from '@components/layout/pagination/pagination';

@Component({
    selector: 'app-user-listing-page',
    imports: [ListingTableAdmin, TranslatePipe, ListingTableAdmin, Pagination],
    templateUrl: './user-listing-page.html',
    styleUrl: './user-listing-page.scss',
})
export class UserListingPage {
    private readonly _userService = inject(UserService);
    private readonly _router = inject(Router);
    count: number | null = null;
    user: UserListing[] = [];
    userError: string | null = null;

    pageSize: number = 10;
    currentPage: number = 1;

    public userColumns: ColumnDefinition[] = [
        {
            property: 'email',
            headerKey: 'common.email',
        },
        // Ajoutez d'autres colonnes ici si nécessaire
    ];

    ngOnInit(): void {
        this._userService
            .getUsers()
            .then((data) => {
                console.log(data);
                this.user = data.data;
            })
            .catch((err) => {
                console.error(err);
                this.userError = err.message;
            });
    }

    onClickDetails(id: string | number) {
        this._router.navigate(['/', 'admin', 'user', id]);
    }

    onClickDelete(id: string | number) {
        //this._router.navigate(['/admin/user', id, 'delete']);
        this._userService
            .deleteUserById(+id)
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
                console.error(err.message);
                this.userError = err.message;
            });
    }

    futurPage(next: number) {
        this._userService
            .getUsers(next - 1)
            .then((data) => {
                this.user = data.data;
                this.count = data.count;
            })
            .catch((err) => {
                console.error(err);
                this.userError = err.message;
            });
    }
}
