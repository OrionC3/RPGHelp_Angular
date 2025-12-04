import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { UserSelfDto } from '@core/models/user-self-dto.model';
import { UserService } from '@core/services/user.service';
import { TranslatePipe } from '@ngx-translate/core';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-self-page',
    imports: [TranslatePipe],
    templateUrl: './self-page.html',
    styleUrl: './self-page.scss',
})
export class SelfPage implements OnInit, OnDestroy {
    private readonly _userService = inject(UserService);
    user: UserSelfDto | null = null;
    userSubscription: Subscription | null = null;
    userError: string | null = null;
    ngOnInit(): void {
        this.userSubscription = this._userService.getUserSelf().subscribe({
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
}
