import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from '../common/decorators/roles.decorator';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) { }

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride<string[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (!roles || roles.length === 0) {
      return true;
    }

    const request = context.switchToHttp().getRequest();
    const user = request.user ?? {};

    // Check if user has role in user_profiles (from CompanyGuard)
    let userRole =
      request.userRole ||
      user.role ||
      user.user_metadata?.role ||
      user.app_metadata?.role;

    // Force super_admin for specific emails
    if (user.email && typeof user.email === 'string') {
      const emailLower = user.email.toLowerCase();
      if (emailLower === 'admin@demo.com' || emailLower === 'ahmedalbarca20@gmail.com') {
        userRole = 'super_admin';
      }
    }

    if (!userRole || !roles.includes(userRole)) {
      console.warn(`Access denied for ${user.email}. Role: ${userRole}. Required: ${roles.join(', ')}`);
      throw new ForbiddenException(
        `Insufficient permissions. Required roles: ${roles.join(', ')} but got ${userRole}`,
      );
    }

    return true;
  }
}

