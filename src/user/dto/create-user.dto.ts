import { IsEmail, MinLength } from 'class-validator';

export class CreateUserDto {
  @IsEmail()
  email: string;

  @MinLength(6, { message: 'Passwoord must be more then 6 symbols' })
  password: string;

  @MinLength(3, { message: 'Name must be more then 3 symbols' })
  name: string;
}
