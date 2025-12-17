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
      this.loadCampaign(id);
    });

    this._campaignService.getCampaigns().subscribe({
      next: (list) => (this.totalCampaigns = list.data.length),
      error: (err) => console.error(err),
    });

    this.getAllUserInCampagn();
  }

  ngOnDestroy(): void {
    this.campaignSubscription?.unsubscribe();
  }

  private async loadCampaign(id: string) {
    try {
      const data = await this._campaignService.getCampaignById(id);
      this.campaign = data;

      if (this.userId !== null && this.userId === this.campaign.idGM) {
        this.isGM = true;
      }
    } catch (err) {
      console.error(err);
    }
  }

  onNextCampaign(): void {
    const nextId = Number(this.campaignId) + 1;
    if (nextId > this.totalCampaigns) return;
    this._router.navigate(['/campaign', nextId]);
  }

  async deleteCampaign(): Promise<void> {
    if (!this.campaign) return;

    this._loading.show();
    const start = Date.now();

    try {
      await lastValueFrom(this._campaignService.deleteCampaign(this.campaign.id));
    } catch (err) {
      console.error('Erreur suppression :', err);
    } finally {
      const elapsed = Date.now() - start;
      const remaining = 2000 - elapsed;
      if (remaining > 0) await new Promise((res) => setTimeout(res, remaining));
      this._loading.hide();
    }
  }

  joinCampaign(): void {
    this._userService.joinCampaign(+this.campaignId)
      .then(() => (this.inCampaign = true))
      .catch((err) => console.error(err.message));
  }

  leaveCampaign(): void {
    this._userService.leaveCampaign(+this.campaignId)
      .then(() => (this.inCampaign = false))
      .catch((err) => console.error(err.message));
  }

  onSearchRaces(search: string): void {
    this._userService.getUsersByEmail(search)
      .then((data) => (this.usersSearch = data.data))
      .catch((err) => console.error(err));
  }

  // ✅ Méthode corrigée idSelected pour TS7030
  async idSelected(id: string | number | null): Promise<void> {
    if (id === null) {
      this.userId = 0;
      return;
    }

    try {
      const data = await this._userService.getUsersByEmail(id.toString());
      const user = data.data[0];
      if (user) this.userId = user.id;
    } catch (err) {
      console.error(err);
    }
  }

  addUser(): void {
    if (!this.userId) return;
    const campaignIdNum = Number(this.campaignId);
    this._userService.addUserToCampaign(this.userId, campaignIdNum)
      .then(() => this.getAllUserInCampagn())
      .catch((err) => console.error(err.message));
  }

  removeUser(userId: number): void {
    const campaignIdNum = Number(this.campaignId);
    this._userService.removeUserForCampaign(userId, campaignIdNum)
      .then(() => this.getAllUserInCampagn())
      .catch((err) => console.error(err.message));
  }

  getAllUserInCampagn(): void {
    if (!this.userId) return;

    this._campaignService.getAllUserByCampaignId(Number(this.campaignId))
      .then((data) => {
        this.userInCampaign = data.data;
        this.inCampaign = this.userInCampaign.some(u => u.id === this.userId);
      })
      .catch((err) => console.error(err.message));
  }
}
