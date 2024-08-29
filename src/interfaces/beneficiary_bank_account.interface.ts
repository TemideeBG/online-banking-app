import { UserBankAccountEntity } from "../entities/user_bank_account.entity";
import { UserInfoEntity } from "../entities/user_info.entity";
import { ACCOUNT_TYPE } from "../enums/ACCOUNT_TYPE.enum";

export interface BeneficiaryBankAccountInterface {
    id: string;
    account_name: string;
    account_number: string;
    starting_balance: number;
    account_balance: number;
    currency: string;
    amount: string;
    account_type: ACCOUNT_TYPE;
    bank_name: string;
    iban: string;
    swift_bic: string;
    country: string;
    userInfo: UserInfoEntity;
    userBankAccount: UserBankAccountEntity;
    createdAt: Date;
    updatedAt: Date;
}
