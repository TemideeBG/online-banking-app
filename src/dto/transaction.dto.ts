import { IsNotEmpty, IsNumber, IsOptional, IsEnum, IsBoolean, IsString } from 'class-validator';
import { TRANSACTION_STATUS } from '../enums/TRANSACTION_STATUS.enum';

export class TransactiontDto {
    @IsNotEmpty()
    transaction_reference: string;

    @IsNotEmpty()
    @IsNumber()
    funds_transferred: number;

    @IsNotEmpty()
    currency: string;

    @IsOptional()
    amount: string;

    @IsOptional()
    @IsNumber()
    conversion_rate: number;

    @IsOptional()
    @IsNumber()
    conversion_amount: number;

    @IsOptional()
    @IsString()
    transaction_type: string;

    @IsNotEmpty()
    @IsEnum(TRANSACTION_STATUS)
    transaction_status: TRANSACTION_STATUS;

    @IsOptional()
    description: string;

    @IsOptional()
    bank_charges: number;

    @IsNotEmpty()
    user_bank_id: string;

    @IsNotEmpty()
    beneficiary_bank_id: string;
}
