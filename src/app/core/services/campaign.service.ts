import { HttpClient } from "@angular/common/http";
import { inject, Injectable } from "@angular/core";
import { ApiResponseList } from "@core/models/api-response-list.model";
import { CampaignDetailsDtoModel } from "@core/models/campaign-details-dto.model";
import { CampaignFormDtoModel } from "@core/models/campaign-form-dto.model";
import { CampaignListing } from "@core/models/campaign-listing.models";
import { environment } from "@env";
import { firstValueFrom, Observable } from "rxjs";

@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private readonly _httpClient = inject(HttpClient);

  getCampaigns(page: number = 0): Observable<ApiResponseList<CampaignListing>> {
    return this._httpClient.get<ApiResponseList<CampaignListing>>(
      `${environment.apiUrl}api/Campagn`,
      {
        params: { page: page },
      }
    );
  }

  getCampaignById(id: string | number): Observable<CampaignDetailsDtoModel> {
    return this._httpClient.get<CampaignDetailsDtoModel>(
      `${environment.apiUrl}api/Campagn/${id}`
    );
  }

  add(form: CampaignFormDtoModel): Promise<void> {
    return firstValueFrom(
      this._httpClient.post<void>(
        `${environment.apiUrl}api/Campagn/`,
        form,
      ),
    );
  }

  deleteCampaign(id: number): Observable<void> {
    return this._httpClient.delete<void>(
      `${environment.apiUrl}api/Campagn/${id}`
    );
  }

    updateCampaign(id: number, form: CampaignFormDtoModel) {
    return this._httpClient.put(
        `${environment.apiUrl}api/campagn/${id}`,
        form
    );
    }

}
