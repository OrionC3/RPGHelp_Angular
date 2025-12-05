import { Component, inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CharatersService } from '@core/services/charaters.service';
import { Subscription } from 'rxjs';

@Component({
    selector: 'app-character-delete-page',
    imports: [],
    templateUrl: './character-delete-page.html',
    styleUrl: './character-delete-page.scss',
})
export class CharacterDeletePage {
    private readonly _charactersService = inject(CharatersService);
    private readonly _router = inject(Router);
    private readonly _activatedRoute = inject(ActivatedRoute);

    userId!: number;
    getUserSubscription: Subscription | null = null;
    ngOnInit(): void {
        this._activatedRoute.params.subscribe({
            next: (params) => {
                this.userId = +params['id'];

                // todo recupéré les info
                this.getUserSubscription = this._charactersService
                    .deleteCharactersById(this.userId)
                    .subscribe({
                        next: () => {
                            this._router.navigate(['/', 'characters']);
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
