import { RaceIndexDto } from './race-index-dto.model';

export interface CharacteresIndexDto {
    id: number;
    name: string;
    idRace: number;
    level: number;
    xp: number;
    userId: number;
    campagnId: number;
    raceIndexDto: RaceIndexDto;
}
