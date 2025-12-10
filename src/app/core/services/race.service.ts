import { HttpClient } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { ApiResponseList } from '@core/models/api-response-list.model';
import { ApiResponseOne } from '@core/models/api-response-one.model';
import { RaceDetailsDto } from '@core/models/race-details-dto.model';
import { RaceFormDto } from '@core/models/race-form-dto.model';
import { RaceIndexDto } from '@core/models/race-index-dto.model';
import { environment } from '@env';
import { firstValueFrom, map } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class RaceService {
    private readonly _httpClient = inject(HttpClient);

    getRaces(page: number = 0): Promise<ApiResponseList<RaceIndexDto>> {
        return firstValueFrom(
            this._httpClient.get<ApiResponseList<RaceIndexDto>>(
                environment.apiUrl + 'api/race',
                {
                    params: {
                        page: page,
                    },
                },
            ),
        );
    }

    getRaceById(id: number = 0): Promise<RaceDetailsDto> {
        return firstValueFrom(
            this._httpClient
                .get<
                    ApiResponseOne<RaceDetailsDto>
                >(environment.apiUrl + 'api/race/' + id)
                .pipe(map((response) => response.data)),
        );
    }

    deleteRaceById(id: number): Promise<void> {
        return firstValueFrom(
            this._httpClient.delete<void>(
                environment.apiUrl + 'api/race/' + id,
            ),
        );
    }

    createRace(form: RaceFormDto): Promise<ApiResponseOne<RaceDetailsDto>> {
        return firstValueFrom(
            this._httpClient.post<ApiResponseOne<RaceDetailsDto>>(
                environment.apiUrl + 'api/race',
                form,
            ),
        );
    }

    getRacesByName(name: string): Promise<ApiResponseList<RaceIndexDto>> {
        return firstValueFrom(
            this._httpClient.get<ApiResponseList<RaceIndexDto>>(
                environment.apiUrl + 'api/race/byname',
                {
                    params: {
                        name: name,
                    },
                },
            ),
        );
    }

    getRaceIdByName(name: string): Promise<ApiResponseOne<RaceIndexDto>> {
        return firstValueFrom(
            this._httpClient.get<ApiResponseOne<RaceIndexDto>>(
                environment.apiUrl + 'api/race/getidbyname',
                {
                    params: {
                        name: name,
                    },
                },
            ),
        );
    }
}
