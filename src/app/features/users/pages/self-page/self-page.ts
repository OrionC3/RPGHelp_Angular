import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { UserSelfDto } from '@core/models/user-self-dto.model';
import { UserService } from '@core/services/user.service';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
    selector: 'app-self-page',
    imports: [TranslatePipe, RouterLink],
    templateUrl: './self-page.html',
    styleUrl: './self-page.scss',
})
export class SelfPage implements OnInit {
    private readonly _userService = inject(UserService);
    user: UserSelfDto | null = null;
    userError: string | null = null;
    ngOnInit(): void {
        this._userService
            .getUserSelf()
            .then((data) => {
                this.user = data.data;
            })
            .catch((err) => {
                console.error(err);
                this.userError = err.message;
            });
    }
}
