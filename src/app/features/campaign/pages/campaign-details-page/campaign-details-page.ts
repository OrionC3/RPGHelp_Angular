import { Component, inject, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { CampaignDetailsDtoModel } from '@core/models/campaign-details-dto.model';
import { UserListing } from '@core/models/user-listing.models';
import { AuthService } from '@core/services/auth.service';
import { CampaignService } from '@core/services/campaign.service';
import { UserService } from '@core/services/user.service';
import { LoadingService } from '@core/services/loading-service';
import { TranslatePipe } from '@ngx-translate/core';
import { lastValueFrom, Subscription } from 'rxjs';
import { InputTextAutocomplete } from '@components/form/input-text-autocomplete/input-text-autocomplete';

@Component({
    selector: 'app-campaign-details-page',
    imports: [RouterLink, TranslatePipe, InputTextAutocomplete],
    templateUrl: './campaign-details-page.html',
    styleUrls: ['./campaign-details-page.scss'],
})
export class CampaignDetailsPage implements OnInit, OnDestroy {
    private readonly _loading = inject(LoadingService);
    private readonly _campaignService = inject(CampaignService);
    private readonly _router = inject(Router);
    private readonly _userService = inject(UserService);
    private readonly _authService = inject(AuthService);

    campaign: CampaignDetailsDtoModel | null = null;
    campaignSubscription!: Subscription;
    users: UserListing[] = [];
    usersSearch: UserListing[] = [];
    inCampaign: boolean = false;
    isGM: boolean = false;
    userId: number | null = this._authService.id();
    userInCampaign: UserListing[] = [];

    totalCampaigns = 0;
    campaignId!: string;

    constructor(private route: ActivatedRoute) {}

    ngOnInit(): void {
        this.campaignSubscription = this.route.paramMap.subscribe((params) => {
            const id = params.get('id');
            if (!id) return;

            this.campaignId = id;

            this._campaignService
                .getCampaignById(id)
                .then((data) => {
                    console.log(data);

                    this.campaign = data;

                    if (this.userId !== null) {
                        if (this.userId == this.campaign.idGM) {
                            this.isGM = true;
                        }
                    }
                })
                .catch((err) => {
                    console.error(err);
                });
        });

        this._campaignService.getCampaigns().subscribe({
            next: (list) => (this.totalCampaigns = list.data.length),
            error: (err) => console.error(err),
        });

        const idUser = this._authService.id();

        this.getAllUserInCampagn();
    }

    ngOnDestroy(): void {
        this.campaignSubscription?.unsubscribe();
    }

    onNextCampaign() {
        const nextId = Number(this.campaignId) + 1;
        if (nextId > this.totalCampaigns) return;
        this._router.navigate(['/campaign', nextId]);
    }

    async deleteCampaign(): Promise<void> {
        if (!this.campaign) return;

        this._loading.show(); // afficher le spinner

        const start = Date.now();

        try {
            // attendre la requête
            await lastValueFrom(
                this._campaignService.deleteCampaign(this.campaign.id),
            );
        } catch (err) {
            console.error('Erreur suppression :', err);
        } finally {
            // calcul du temps écoulé
            const elapsed = Date.now() - start;
            const remaining = 2000 - elapsed;

            // attendre seulement si la requête a été trop rapide
            if (remaining > 0) {
                await new Promise((res) => setTimeout(res, remaining));
            }

            this._loading.hide(); // cacher le spinner
        }
    }

    joinCampaign() {
        //appel db avec l'id de la campagne pour la rejoindre
        this._userService
            .joinCampaign(+this.campaignId)
            .then(() => {
                this.inCampaign = true;
            })
            .catch((err) => {
                console.error(err.message);
            });
    }

    leaveCampaign() {
        this._userService
            .leaveCampaign(+this.campaignId)
            .then(() => {
                this.inCampaign = false;
            })
            .catch((err) => {
                console.error(err.message);
            });
    }

    onSearchRaces(search: string) {
        this._userService
            .getUsersByEmail(search)
            .then((data) => {
                this.usersSearch = data.data;
            })
            .catch((err) => {
                console.error('Erreur de chargement des utilisateurs:', err);
            });
    }
    user: UserListing | null = null;
    idSelected(id: string | number | null) {
        if (id === null) {
            this.userId = 0; // or set to a default value like 0
            return;
        }
        //récupéré l'id de la race avant de l'assigné
        this._userService
            .getUsersByEmail(id.toString())
            .then((data) => {
                this.user = data.data[0];
                this.userId = this.user.id;
            })
            .catch((err) => {
                console.error(err.message);
            });

        this.userId = parseInt(String(id), 10);
    }

    addUser() {
        this.campaignSubscription = this.route.paramMap.subscribe((params) => {
            const campaignId = params.get('id');
            if (campaignId !== null) {
                const IdCampaign = parseInt(campaignId, 10);
                if (this.userId !== null) {
                    this._userService
                        .addUserToCampaign(this.userId, IdCampaign)
                        .then(() => this.getAllUserInCampagn())
                        .catch((err) => console.error(err.message));
                }
            }
        });
    }

    removeUser(userId: number) {
        this.campaignSubscription = this.route.paramMap.subscribe((params) => {
            const campaignId = params.get('id');
            if (campaignId !== null) {
                const IdCampaign = parseInt(campaignId, 10);
                this._userService
                    .removeUserForCampaign(userId, IdCampaign)
                    .then(() => this.getAllUserInCampagn())
                    .catch((err) => console.error(err.message));
            }
        });
    }

    getAllUserInCampagn() {
        const idUser = this._authService.id();
        if (idUser !== null) {
            this._campaignService
                .getAllUserByCampaignId(+this.campaignId)
                .then((data) => {
                    this.userInCampaign = data.data;
                    for (
                        let index = 0;
                        index < this.userInCampaign.length;
                        index++
                    ) {
                        if (this.userInCampaign[index].id === idUser) {
                            this.inCampaign = true;
                        }
                    }
                })
                .catch((err) => {
                    console.error(err.message);
                });
        }
    }
}
