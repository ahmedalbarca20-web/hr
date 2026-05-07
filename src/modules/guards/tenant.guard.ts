import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';

@Injectable()
export class TenantGuard implements CanActivate {
  canActivate(context: ExecutionContext): boolean {
    const request = context.switchToHttp().getRequest();
    const headerCompanyId = request.headers['x-company-id'] as
      | string
      | undefined;
    const jwtCompanyId = request.user?.company_id ??
      request.user?.app_metadata?.company_id;

    const companyId = headerCompanyId ?? jwtCompanyId;
    if (!companyId) {
      throw new ForbiddenException('Missing company_id');
    }

    request.tenant = { companyId };
    return true;
  }
}
