import { Injectable, CanActivate, ExecutionContext } from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { ROLES_KEY } from 'src/decorators/roles.decorator';
import { Role } from 'src/roles/entities/role.entity';

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private reflector: Reflector) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const availableRoles = this.reflector.getAllAndOverride<Role[]>(ROLES_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);
    
    if (!availableRoles) {
      return true;
    }
    const request = context.switchToHttp().getRequest();

    try {
      const role = request.user.role.roleName;
      if (!role) return false;

      return availableRoles.includes(role);
    } catch (error) {
      return false;
    }
  }
}
