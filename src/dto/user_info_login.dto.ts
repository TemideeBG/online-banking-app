import { IsNotEmpty, IsEmail, IsEnum, IsDateString, IsOptional, IsNumberString, IsString, IsNumber, Length, Matches } from 'class-validator';
import { MESSAGE, REGEX } from '../utils/password_rule';

export class UserInfoLoginDto {
    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(6, 24)
    @Matches(REGEX.PASSWORD_RULE, {
        message: MESSAGE.PASSWORD_RULE_MESSAGE,
      })
    password: string;
}
