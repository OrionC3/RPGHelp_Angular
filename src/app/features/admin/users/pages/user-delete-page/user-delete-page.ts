import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { UserService } from '@core/services/user.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-user-delete-page',
    imports: [],
    templateUrl: './user-delete-page.html',
    styleUrl: './user-delete-page.scss',
})
export class UserDeletePage {
    private readonly _userService = inject(UserService);
    private readonly _router = inject(Router);
    private readonly _activatedRoute = inject(ActivatedRoute);

    userId!: number;
    getUserSubscription: Subscription | null = null;
    ngOnInit(): void {
        this._activatedRoute.params.subscribe({
            next: (params) => {
                this.userId = +params['id'];

                // todo recupéré les info
                this.getUserSubscription = this._userService
                    .deleteUserById(this.userId)
                    .subscribe({
                        next: () => {
                            this._router.navigate(['/', 'admin', 'user']);
                        },
                        error: (err) => {
                            console.error(err);
                        },
                    });
            },
        });
    }

    ngOnDestroy(): void {
        this.getUserSubscription?.unsubscribe();
    }
}
