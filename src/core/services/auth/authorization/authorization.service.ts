import { Inject, Injectable } from '@nestjs/common';
import { Enforcer } from 'casbin';
import { SysConfigService } from 'src/infra/services';
import { CASBIN_ENFORCER } from 'src/core/constants/token.const';
import { AuthorizationAction } from 'src/core/constants/enums/authorization.action.enum';

@Injectable()
export class AuthorizationService {
  constructor(
    @Inject(CASBIN_ENFORCER) private readonly enforcer: Enforcer,
  ) {}

  public checkPermission(
    subject: string,
    object: string,
    action: AuthorizationAction,
  ) {
    return this.enforcer.enforce(subject, object, action);
  }

  public mappingAction(method: string) {
    const table: Record<string, AuthorizationAction> = {
      GET: AuthorizationAction.READ,
      POST: AuthorizationAction.CREATE,
      PUT: AuthorizationAction.UPDATE,
      PATCH: AuthorizationAction.UPDATE,
      DELETE: AuthorizationAction.DELETE,
    };

    return table[method.toUpperCase()];
  }
}
