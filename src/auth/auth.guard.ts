import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {} // Inject JwtService for manual verification

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const request = context.switchToHttp().getRequest<Request>();

    const token = this.extractTokenFromHeader(request);

    if (!token) {
      throw new UnauthorizedException('Authentication token missing');
    }

    try {
      // Verify and decode
      const payload = await this.jwtService.verifyAsync(token, {
        secret: process.env.APP_SECRET, // Use your app secret
      });

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
