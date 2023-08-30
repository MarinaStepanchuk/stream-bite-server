import {
  Controller,
  Post,
  Body,
  UsePipes,
  ValidationPipe,
  Get,
  UseGuards,
  Req,
  Param,
} from '@nestjs/common';
import { UserService } from './user.service';
import { CreateUserDto } from './dto/create-user.dto';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Post()
  @UsePipes(new ValidationPipe())
  create(@Body() createUserDto: CreateUserDto) {
    return this.userService.create(createUserDto);
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  getProfile(@Req() req) {
    return req.user;
  }

  @Get(':id')
  findOne(@Param('id') id: string) {
    return this.userService.findUserById(+id);
  }
}
