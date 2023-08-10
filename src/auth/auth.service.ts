import {
  BadRequestException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { UserService } from '../user/user.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { IUser } from 'src/types/types';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UserService,
    private jwtService: JwtService,
  ) {}

  async validateUser(email: string, password: string): Promise<any> {
    const user = await this.usersService.findOne(email);

    if (!user) {
      throw new BadRequestException('User or password is incorrect');
    }

    const passwordIsMatch = await argon2.verify(user.password, password);

    if (user && passwordIsMatch) {
      return user;
    }

    throw new UnauthorizedException('User or password is incorrect');
  }

  async login(user: IUser) {
    const { id, email, name } = user;
    const payload = { email: user.email, id: user.id };
    return {
      id,
      email,
      name,
      token: this.jwtService.sign(payload),
    };
  }
}
