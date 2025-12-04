import { BonusRacialIndexDto } from './bonus-racial-index-dto.model';

export interface RaceIndexDto {
    id: number;
    name: string;
    travelSpeed: number;
    bonusRacial: BonusRacialIndexDto;
}
