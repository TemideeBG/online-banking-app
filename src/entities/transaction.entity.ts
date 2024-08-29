import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne } from 'typeorm';
import { UserInfoEntity } from './user_info.entity';
import { UserBankAccountEntity } from './user_bank_account.entity';
import { BeneficiaryBankAccountEntity } from './beneficiary_bank_account.entity';
import { TransactionInterface } from '../interfaces/transaction.interface';
import { TRANSACTION_STATUS } from '../enums/TRANSACTION_STATUS.enum';

@Entity({ name: 'transaction_entity' })
export class TransactionEntity implements TransactionInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    transaction_reference: string;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: false })
    funds_transferred: number;

    @Column({ nullable: false })
    currency: string;

    @Column({ nullable: false })
    amount: string;

    @Column({ type: 'decimal', precision: 18, scale: 4, nullable: true })
    conversion_rate: number;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    conversion_amount: number;

    @Column({ nullable: false, default: 'DEBIT' })
    transaction_type: string;  // 'DEBIT' or 'CREDIT'

    @Column({ type: 'enum', enum: TRANSACTION_STATUS, default: TRANSACTION_STATUS.PENDING })
    transaction_status: TRANSACTION_STATUS;

    @Column({ nullable: true })
    description: string;

    @Column({ type: 'decimal', precision: 18, scale: 2, nullable: true })
    bank_charges: number;

    @ManyToOne(() => UserInfoEntity, userInfo => userInfo.transactions)
    userInfo: UserInfoEntity;

    @ManyToOne(() => UserBankAccountEntity, userBankAccount => userBankAccount.transactions)
    userBankAccount: UserBankAccountEntity;

    @ManyToOne(() => BeneficiaryBankAccountEntity, beneficiaryBankAccount => beneficiaryBankAccount.transactions, { onDelete: 'CASCADE' })
    beneficiaryBankAccount: BeneficiaryBankAccountEntity;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;
}

