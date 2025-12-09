import { RaceIndexDto } from './race-index-dto.model';

export interface CharactersIndexDto {
    id: number;
    name: string;
    raceId: number;
    level: number;
    xp: number;
    userId: number;
    campagnId: number;
    raceIndexDto: RaceIndexDto;
}
