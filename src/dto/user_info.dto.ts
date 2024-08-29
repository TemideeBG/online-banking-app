import { IsNotEmpty, IsEmail, IsEnum, IsDateString, IsOptional, IsNumberString, IsString, IsNumber, Length, Matches } from 'class-validator';
import { MESSAGE, REGEX } from '../utils/password_rule';
import { USER_ROLES } from '../enums/USER_ROLES.enum';
import { VERIFICATION_STATUS } from '../enums/VERIFICATION_STATUS.enum';

export class UserInfoDto {
    @IsNotEmpty()
    first_name: string;

    @IsNotEmpty()
    last_name: string;

    @IsNotEmpty()
    full_name: string;

    @IsNotEmpty()
    @IsEmail()
    email: string;

    @IsNotEmpty()
    @Length(6, 24)
    @Matches(REGEX.PASSWORD_RULE, {
        message: MESSAGE.PASSWORD_RULE_MESSAGE,
      })
    password: string;

    @IsEnum(USER_ROLES)
    @IsOptional()
    role: USER_ROLES;

    @IsOptional()
    @IsNumberString()
    phone_number: string;

    @IsOptional()
    nationality: string;
    
    @IsOptional()
    home_address: string;
      
    @IsOptional()
    state_of_residence: string;

    @IsOptional()
    country_of_residence: string;
    
    @IsNotEmpty()
    @IsString()
    gender: string;
      
    @IsNotEmpty()
    @IsDateString()
    date_of_birth: Date;

    @IsOptional()
    @IsNumber()
    age: number;

    @IsOptional()
    @IsEnum(VERIFICATION_STATUS)
    verification_status: VERIFICATION_STATUS;

    @IsOptional()
    @IsNumber()
    otp: number;
}
