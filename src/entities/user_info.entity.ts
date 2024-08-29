// UserInfo.ts
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, OneToMany } from 'typeorm';
import { UserInfoInterface } from '../interfaces/user_info.interface';
import { UserBankAccountEntity } from './user_bank_account.entity';
import { USER_ROLES } from '../enums/USER_ROLES.enum';
import { VERIFICATION_STATUS } from '../enums/VERIFICATION_STATUS.enum';
import { BeneficiaryBankAccountEntity } from './beneficiary_bank_account.entity';
import { TransactionEntity } from './transaction.entity';

@Entity({ name: 'user_info' })
export class UserInfoEntity implements UserInfoInterface {
    @PrimaryGeneratedColumn('uuid')
    id: string;

    @Column({ nullable: false })
    first_name: string;

    @Column({ nullable: false })
    last_name: string;

    @Column({ nullable: false })
    full_name: string;

    @Column({ nullable: false, unique: true })
    email: string;

    @Column({ nullable: false })
    password: string;

    @Column({ nullable: false, type: 'enum', enum: USER_ROLES, default: "USER" })
    role: USER_ROLES;

    @Column({ default: "", unique: true })
    phone_number: string;

    @Column({ default: "nigerian" })
    nationality: string;
    
    @Column({ default: "" })
    home_address: string;
      
    @Column({ default: "" })
    state_of_residence: string;

    @Column({ default: "nigeria" })
    country_of_residence: string;
    
    @Column({ nullable:false })
    gender: string;
      
    @Column({ type: 'date' })
    date_of_birth: Date;

    @Column({ nullable: true })
    age: number;

    @Column({ nullable: true, type: 'enum', enum: VERIFICATION_STATUS, default: "UNVERIFIED" })
    verification_status: VERIFICATION_STATUS;

    @Column({ type: 'int' })
    otp: number;

    @CreateDateColumn()
    createdAt: Date;

    @UpdateDateColumn()
    updatedAt: Date;

    @OneToOne(() => UserBankAccountEntity, userBankAccount=>userBankAccount.userInfo)
    userBankAccount: UserBankAccountEntity;

    @OneToMany(() => BeneficiaryBankAccountEntity, beneficiaryBankAccount => beneficiaryBankAccount.userInfo)
    beneficiaryBankAccounts: BeneficiaryBankAccountEntity[];

    @OneToMany(() => TransactionEntity, transaction => transaction.userInfo)
    transactions: TransactionEntity[];

}

