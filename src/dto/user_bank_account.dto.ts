import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsIn, IsBoolean } from 'class-validator';
import { ACCOUNT_TYPE } from '../enums/ACCOUNT_TYPE.enum';


export class UserBankAccountDto {
    @IsNotEmpty()
    account_name: string;

    @IsNotEmpty()
    account_number: string;

    @IsOptional()
    @IsNumber()
    account_balance: number;

    @IsNotEmpty()
    currency: string;

    @IsOptional()
    amount: string;

    @IsNotEmpty()
    @IsEnum(ACCOUNT_TYPE)
    account_type: ACCOUNT_TYPE;

    @IsNotEmpty()
    bank_name: string;

    @IsOptional()
    country: string;

    @IsOptional()
    @IsBoolean()
    taxExempt: boolean;
}
