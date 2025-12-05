import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { UserListing } from '@core/models/user-listing.models';
import { UserService } from '@core/services/user.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';
import { ListingTableAdmin } from '@components/common/listing-table-admin/listing-table-admin';
import { ColumnDefinition } from '@core/models/column-definition.models';

@Component({
    selector: 'app-user-listing-page',
    imports: [ListingTableAdmin, TranslatePipe, ListingTableAdmin],
    templateUrl: './user-listing-page.html',
    styleUrl: './user-listing-page.scss',
})
export class UserListingPage {
    private readonly _userService = inject(UserService);
    private readonly _router = inject(Router);
    count: number | null = null;
    user: UserListing[] = [];
    userSubscription: Subscription | null = null;
    userError: string | null = null;

    public userColumns: ColumnDefinition[] = [
        {
            property: 'email',
            headerKey: 'features.admin.users.pages.user-listing-page.email',
        },
        // Ajoutez d'autres colonnes ici si nécessaire
    ];

    ngOnInit(): void {
        this.userSubscription = this._userService.getUsers().subscribe({
            next: (data) => {
                console.log(data);
                this.user = data.data;
            },
            error: (err) => {
                console.error(err);
                this.userError = err.message;
            },
        });
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }

    onClickDetails(id: string | number) {
        this._router.navigate(['/', 'admin', 'user', id]);
    }

    onClickDelete(id: string | number) {
        this._router.navigate(['/admin/user', id, 'delete']);
    }
}
