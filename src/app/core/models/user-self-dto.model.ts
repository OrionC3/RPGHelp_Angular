import { CampagnIndexDto } from './campagn-index-dto.model';
import { CharactersIndexDto } from './characters-index-dto.model';
import { UserRoleApi } from './user.role.model';

export interface UserSelfDto {
    id: number;
    email: string;
    password: string;
    role: UserRoleApi[];
    characteres: CharactersIndexDto[];
    campagns: CampagnIndexDto[];
}
