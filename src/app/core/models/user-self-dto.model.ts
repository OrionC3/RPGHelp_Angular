import { CharacteresIndexDto } from './charactere-index-dto.model';
import { CampagnIndexDto } from './campagn-index-dto.model';
import { UserRoleApi } from './user.role.model';

export interface UserSelfDto {
    id: number;
    email: string;
    password: string;
    role: UserRoleApi[];
    characteres: CharacteresIndexDto[];
    campagns: CampagnIndexDto[];
}
