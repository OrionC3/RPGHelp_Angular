import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponseList } from '@core/models/api-response-list.model';
import { ApiResponseOne } from '@core/models/api-response-one.model';
import { UserDetails } from '@core/models/user-details-models';
import { UserListing } from '@core/models/user-listing.models';
import { UserSelfDto } from '@core/models/user-self-dto.model';
import { environment } from '@env';
import { firstValueFrom, map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class UserService {
    private readonly _httpClient = inject(HttpClient);

    getUsers(page: number = 0): Promise<ApiResponseList<UserListing>> {
        // Appel HTTP GET pour récupérer la liste des utilisateurs avec pagination
        //console.log(environment.apiUrl + 'api/user');

        return firstValueFrom(
            this._httpClient.get<ApiResponseList<UserListing>>(
                environment.apiUrl + 'api/user',
                {
                    // Paramètres de requête pour la pagination (rajoute ?page=1, ?page=2, etc. à l'URL)
                    params: {
                        page: page,
                    },
                },
            ),
        );
    }

    getUserSelf(): Promise<ApiResponseOne<UserSelfDto>> {
        return firstValueFrom(
            this._httpClient.get<ApiResponseOne<UserSelfDto>>(
                environment.apiUrl + 'api/user/self',
            ),
        );
    }

    getUserById(id: number = 0): Promise<UserDetails> {
        //console.log(environment.apiUrl + 'api/user');
        return firstValueFrom(
            this._httpClient
                .get<
                    ApiResponseOne<UserDetails>
                >(environment.apiUrl + 'api/user/' + id)
                .pipe(map((response) => response.data)),
        );
    }

    deleteUserById(id: number): Promise<UserDetails> {
        //console.log(environment.apiUrl + 'api/user/' + id);
        return firstValueFrom(
            this._httpClient.delete<UserDetails>(
                environment.apiUrl + 'api/user/' + id,
            ),
        );
    }

    joinCampaign(id: number): Promise<void> {
        return firstValueFrom(
            this._httpClient.post<void>(
                environment.apiUrl + 'api/user/join-campagn',
                id,
            ),
        );
    }

    leaveCampaign(id: number): Promise<void> {
        return firstValueFrom(
            this._httpClient.post<void>(
                environment.apiUrl + 'api/user/leave-campagn',
                id,
            ),
        );
    }
}
