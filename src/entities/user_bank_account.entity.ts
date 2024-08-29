// UserInfo.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, PrimaryColumn, OneToMany } from 'typeorm';
import { UserInfoEntity } from './user_info.entity';
import { UserBankAccountInterface } from '../interfaces/user_bank_account.interface';
import { ACCOUNT_TYPE } from '../enums/ACCOUNT_TYPE.enum';
import { BeneficiaryBankAccountEntity } from './beneficiary_bank_account.entity';
import { TransactionEntity } from './transaction.entity';

@Entity({ name: 'user_bank_account' })
export class UserBankAccountEntity implements UserBankAccountInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    account_name: string;

    @Column({ nullable: false })
    account_number: string;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    account_balance: number;

    @Column({ nullable: false })
    currency: string;

    @Column({ nullable: true })
    amount: string;

    @Column({ nullable: false, type: 'enum', enum: ACCOUNT_TYPE, default: "CURRENT" })
    account_type: ACCOUNT_TYPE;

    @Column({ nullable: false })
    bank_name: string;

    @Column({ default: 'nigeria' })
    country: string;

    @Column({ default: false })
    taxExempt: boolean;
      
    @OneToOne(() => UserInfoEntity, userInfo=>userInfo.userBankAccount)
    @JoinColumn({ name: "user_id" })
    userInfo: UserInfoEntity;

    @OneToMany(() => BeneficiaryBankAccountEntity, beneficiaryBankAccount => beneficiaryBankAccount.userBankAccount)
    beneficiaryBankAccounts: BeneficiaryBankAccountEntity[];

    @OneToMany(() => TransactionEntity, transaction => transaction.userBankAccount)
    transactions: TransactionEntity[];
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

