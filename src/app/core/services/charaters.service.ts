import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponseList } from '@core/models/api-response-list.model';
import { CharactersIndexDto } from '@core/models/characters-index-dto.model';
import { environment } from '@env';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CharatersService {
    private readonly _httpClient = inject(HttpClient);

    getCharacters(
        page: number = 0,
    ): Observable<ApiResponseList<CharactersIndexDto>> {
        // Appel HTTP GET pour récupérer la liste des utilisateurs avec pagination
        //console.log(environment.apiUrl + 'api/user');

        return this._httpClient.get<ApiResponseList<CharactersIndexDto>>(
            environment.apiUrl + 'api/charactere',
            {
                // Paramètres de requête pour la pagination (rajoute ?page=1, ?page=2, etc. à l'URL)
                params: {
                    page: page,
                },
            },
        );
    }

    // getUserSelf(): Observable<ApiResponseOne<UserSelfDto>> {
    //     return this._httpClient.get<ApiResponseOne<UserSelfDto>>(
    //         environment.apiUrl + 'api/user/self',
    //     );
    // }

    // getUserById(id: number = 0): Observable<UserDetails> {
    //     //console.log(environment.apiUrl + 'api/user');
    //     return this._httpClient
    //         .get<
    //             ApiResponseOne<UserDetails>
    //         >(environment.apiUrl + 'api/user/' + id)
    //         .pipe(map((response) => response.data));
    // }

    deleteCharactersById(id: number): Observable<CharactersIndexDto> {
        //console.log(environment.apiUrl + 'api/user/' + id);
        return this._httpClient.delete<CharactersIndexDto>(
            environment.apiUrl + 'api/charactere/' + id,
        );
    }
}
