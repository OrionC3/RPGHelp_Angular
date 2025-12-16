import { RaceIndexDto } from './race-index-dto.model';

export interface CharactersDetailsDto {
    id: number;
    baseAttackBonus: number;
    charisma: number;
    constitution: number;
    defence: number;
    dexterity: number;
    fortitudeSave: number;
    initiative: number;
    intelligence: number;
    level: number;
    name: string;
    pvCurrent: number;
    pvMax: number;
    raceId: number;
    raceIndexDto: RaceIndexDto | null;
    reflexeSave: number;
    speed: number;
    strength: number;
    willpowerSave: number;
    wisdom: number;
    xp: number;
    userId: number;
}
