import { BonusRacialFormDto } from './bonus-racial-form-dto.model';

export interface RaceFormDto {
    name: string;
    travelSpeed: number;
    bonusRacialFormDto: BonusRacialFormDto;
}
