import { UserInfoEntity } from "../entities/user_info.entity";
import { ACCOUNT_TYPE } from "../enums/ACCOUNT_TYPE.enum";

export interface UserBankAccountInterface {
    id: string;
    account_name: string;
    account_number: string;
    account_balance: number;
    currency: string;
    amount: string;
    account_type: ACCOUNT_TYPE;
    bank_name: string;
    country: string;
    userInfo: UserInfoEntity;
    createdAt: Date;
    updatedAt: Date;
}
