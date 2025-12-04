import { UserRole } from '@core/enums';

export interface Token {
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/Sid': number;
    'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': UserRole;
    iat: number;
    exp: number;
}
