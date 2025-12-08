import { BonusRacialIndexDto } from './bonus-racial-index-dto.model';

export interface RaceDetailsDto {
    id: number;
    name: string;
    travelSpeed: number;
    bonusRacial: BonusRacialIndexDto;
}
