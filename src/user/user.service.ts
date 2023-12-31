import { BadRequestException, Injectable } from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository } from 'typeorm';
import * as argon2 from 'argon2';

@Injectable()
export class UserService {
  constructor(
    @InjectRepository(User) private readonly userRepository: Repository<User>,
  ) {}

  async create(createUserDto: CreateUserDto) {
    const existUser = await this.userRepository.findOne({
      where: {
        email: createUserDto.email,
      },
    });

    if (existUser) {
      throw new BadRequestException('This email already exists');
    }

    const existUserWithName = await this.userRepository.findOne({
      where: {
        name: createUserDto.name,
      },
    });

    if (existUserWithName) {
      throw new BadRequestException('User with this name already exists');
    }

    const hash = await argon2.hash(createUserDto.password);
    const user = await this.userRepository.save({
      email: createUserDto.email,
      name: createUserDto.name,
      password: hash,
    });

    return { user };
  }

  async findUserByEmail(email: string) {
    return await this.userRepository.findOne({
      where: {
        email,
      },
    });
  }

  async findUserById(id: number) {
    return await this.userRepository.findOne({
      where: {
        id,
      },
      select: {
        id: true,
        name: true,
        email: true,
      },
    });
  }
}
