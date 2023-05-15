import { CanActivate, ExecutionContext, Injectable } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { UserRole } from '@prisma/client';

@Injectable()
export class WithRoles implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(context: ExecutionContext): boolean {
    const roles = this.reflector.getAllAndOverride('roles', [
      context.getHandler(),
      context.getClass(),
    ]) as UserRole[];

    if (!roles) return true;

    const request = context.switchToHttp().getRequest();

    if (roles.includes(request.user?.role)) return true;

    return false;
  }
}
