import { BadRequestException, Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { UsersService } from 'src/users/users.service';
import { AuthDto } from './dto/auth-dto';
import { Hash } from 'src/common/utils/hash';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private readonly usersService: UsersService
  ) { }

  async login(authDto: AuthDto) {
    //find user
    const user = await this.usersService.findOne(authDto.email);
    //validate
    if (!user) {
      throw new UnauthorizedException('User not found');
    }
    const isPasswordValid = await Hash.compare(authDto.password, user.password);
    if (!isPasswordValid) {
      throw new UnauthorizedException('Invalid credentials');
    }
    //check email
    if (user.email !== authDto.email) {
      throw new BadRequestException('Email does not match');
    }
    // destructure user to get needed properties
    const { id, password, created_at, updated_at, deleted_at, ...rest } = user;
    const payload = { sub: user.id, ...rest };
    return await this.jwtService.signAsync(payload);
  }
}
