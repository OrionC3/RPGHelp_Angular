import { Component, inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { UserDetails } from '@core/models/user-details-models';
import { UserService } from '@core/services/user.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-user-details-page',
    imports: [TranslatePipe],
    templateUrl: './user-details-page.html',
    styleUrl: './user-details-page.scss',
})
export class UserDetailsPage {
    private readonly _userService = inject(UserService);
    private readonly _activactedRoute = inject(ActivatedRoute);

    count: number | null = null;
    user: UserDetails | null = null;
    userSubscription: Subscription | null = null;
    userError: string | null = null;

    ngOnInit(): void {
        this._activactedRoute.params.subscribe({
            next: (params) => {
                this._userService
                    .getUserById(+params['id'])
                    .then((data) => {
                        console.log(data);
                        this.user = data;
                        console.log(this.user);
                    })
                    .catch((err) => {
                        console.error(err);
                        this.userError = err.message;
                    });
            },
        });
    }

    ngOnDestroy(): void {
        this.userSubscription?.unsubscribe();
    }
}
