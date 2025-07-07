import { Injectable } from '@nestjs/common';
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
    if (!user || !await Hash.compare(authDto.password, user.password)) {
      throw new Error('User not found');
    }
    //check email
    if (user.email !== authDto.email) {
      throw new Error('Email does not match');
    }
    // Here you would typically validate the password
    const payload = { email: user.email, sub: user.id };
    return {
      access_token: this.jwtService.sign(payload),
      user,
    };
  }
}
