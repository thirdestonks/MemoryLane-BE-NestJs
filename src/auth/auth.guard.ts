import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';
import { Reflector } from '@nestjs/core';
import { Role } from 'src/common/roles/role.enum';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService, private reflector: Reflector) {} // Inject JwtService for manual verification

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();
    const requiredRoles = this.reflector.getAllAndOverride<Role[]>('roles', [
      context.getHandler(),
      context.getClass(),
    ]);

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      // Verify and decode
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.APP_SECRET, // Use your app secret
      });

      //Verify Role/s
      if (requiredRoles && !requiredRoles.includes(payload.role)) {
        throw new ForbiddenException;
      }

      request['user'] = {
        id: payload.sub,
        email: payload.email,
        role: payload.role,
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid or expired token');
    }

    return true;
  }
  // Separate Bearer and token extraction logic
  private extractTokenFromHeader(request: Request): string | undefined {
    const authHeader = request.headers.authorization || '';
    const [type, token] = authHeader.split(' ');
    return type === 'Bearer' && token ? token : undefined;
  }
}
