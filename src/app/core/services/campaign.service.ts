import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiResponseList } from "@core/models/api-response-list.model";
import { CampagnIndexDto } from "@core/models/campagn-index-dto.model";
import { CampaignDetailsDtoModel } from "@core/models/campaign-details-dto.model";
import { CampaignListing } from "@core/models/campaign-listing.models";
import { environment } from "@env";
import { CampaignDetailsPage } from "@features/campaign/pages/campaign-details-page/campaign-details-page";
import { CampaignListingPage } from "@features/campaign/pages/campaign-listing-page/campaign-listing-page";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root',
})
export class CampaignService {
    private readonly _httpClient = inject(HttpClient);

    getCampaigns(page: number = 0): Observable<ApiResponseList<CampaignListing>> {
        // Appel HTTP GET pour récupérer la liste des utilisateurs avec pagination
        //console.log(environment.apiUrl + 'api/user');
        console.log(environment.apiUrl + 'api/campagn')
        return this._httpClient.get<ApiResponseList<CampaignListing>>(
            environment.apiUrl + 'api/campagn',
            
            {
                // Paramètres de requête pour la pagination (rajoute ?page=1, ?page=2, etc. à l'URL)
                params: {
                    page: page,
                },
            },
        );
    }
    getCampaignById(id: string | number): Observable<CampaignDetailsDtoModel> {
        return this._httpClient.get<CampaignDetailsDtoModel>(
        `${environment.apiUrl}api/campagn/${id}`
    );
    }

}
