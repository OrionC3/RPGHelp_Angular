import { Component, inject } from '@angular/core';
import { Router } from '@angular/router';
import { ListingTable } from '@components/common/listing-table/listing-table';
import { UserListing } from '@core/models/user-listing.models';
import { UserService } from '@core/services/user.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-user-listing-page',
    imports: [ListingTable, TranslatePipe],
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
}
