import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponseList } from '@core/models/api-response-list.model';
import { ApiResponseOne } from '@core/models/api-response-one.model';
import { CharactersDetailsDto } from '@core/models/characters-details-dto.models';
import { CharactersIndexDto } from '@core/models/characters-index-dto.model';
import { environment } from '@env';
import { map, Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class CharatersService {
    private readonly _httpClient = inject(HttpClient);

    getCharacters(
        page: number = 0,
    ): Observable<ApiResponseList<CharactersIndexDto>> {
        return this._httpClient.get<ApiResponseList<CharactersIndexDto>>(
            environment.apiUrl + 'api/charactere',
            {
                params: {
                    page: page,
                },
            },
        );
    }

    getCharactersById(id: number = 0): Observable<CharactersDetailsDto> {
        return this._httpClient
            .get<
                ApiResponseOne<CharactersDetailsDto>
            >(environment.apiUrl + 'api/charactere/' + id)
            .pipe(map((response) => response.data));
    }

    deleteCharactersById(id: number): Observable<CharactersIndexDto> {
        return this._httpClient.delete<CharactersIndexDto>(
            environment.apiUrl + 'api/charactere/' + id,
        );
    }
}
