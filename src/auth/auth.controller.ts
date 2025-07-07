import { Controller, Get, Post, Body, Patch, Param, Delete } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthDto } from './dto/auth-dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  async login(@Body() body: AuthDto) {
    return await this.authService.login(body);
  }

  // @Post('signup')
  // async signup(@Body() body: SignUpDto) {
  //   return await this.authService.signUp(body);
  // }
}
