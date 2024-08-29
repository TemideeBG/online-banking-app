import { BeneficiaryBankAccountEntity } from "../entities/beneficiary_bank_account.entity";
import { UserBankAccountEntity } from "../entities/user_bank_account.entity";
import { UserInfoEntity } from "../entities/user_info.entity";
import { TRANSACTION_STATUS } from "../enums/TRANSACTION_STATUS.enum";

export interface TransactionInterface {
    id: string;
    transaction_reference: string;
    funds_transferred: number;
    currency: string;
    amount: string;
    conversion_rate: number;
    conversion_amount: number;
    transaction_type: string;
    transaction_status: TRANSACTION_STATUS;
    description: string;
    bank_charges: number;
    userInfo: UserInfoEntity;
    userBankAccount: UserBankAccountEntity;
    beneficiaryBankAccount: BeneficiaryBankAccountEntity;
    createdAt: Date;
    updatedAt: Date;
}
