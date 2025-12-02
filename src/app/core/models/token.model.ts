import { UserRole } from "@core/enums";



export interface Token {
  userId: number;
  role: UserRole;
  iat: number;
  exp: number;
}
