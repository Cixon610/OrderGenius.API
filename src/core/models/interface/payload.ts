import { Role } from "src/core/constants/enums/role.enum";

export interface IUserPayload {
  id: string;
  username: string;
  role: Role;
}
