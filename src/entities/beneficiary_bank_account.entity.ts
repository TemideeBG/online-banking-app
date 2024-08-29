// UserInfo.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn, PrimaryColumn, ManyToOne, OneToMany } from 'typeorm';
import { UserInfoEntity } from './user_info.entity';
import { ACCOUNT_TYPE } from '../enums/ACCOUNT_TYPE.enum';
import { BeneficiaryBankAccountInterface } from '../interfaces/beneficiary_bank_account.interface';
import { UserBankAccountEntity } from './user_bank_account.entity';
import { TransactionEntity } from './transaction.entity';

@Entity({ name: 'beneficiary_bank_account' })
export class BeneficiaryBankAccountEntity implements BeneficiaryBankAccountInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    account_name: string;

    @Column({ nullable: true })
    account_number: string;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    starting_balance: number;

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

    @Column({ nullable: true })
    iban: string;

    @Column({ nullable: true })
    swift_bic: string;

    @Column({ default: 'nigeria' })
    country: string;

    @Column({ default: false })
    taxExempt: boolean;
      
    @ManyToOne(() => UserInfoEntity, userInfo=>userInfo.beneficiaryBankAccounts)
    userInfo: UserInfoEntity;

    @ManyToOne(() => UserBankAccountEntity, userBankAccount => userBankAccount.beneficiaryBankAccounts)
    userBankAccount: UserBankAccountEntity;

    @OneToMany(() => TransactionEntity, transaction => transaction.beneficiaryBankAccount)
    transactions: TransactionEntity[];
    
    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

