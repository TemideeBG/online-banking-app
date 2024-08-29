import { MigrationInterface, QueryRunner } from "typeorm";

export class ModifyAccountBalanceToUseDecimalPrecision1724864348005 implements MigrationInterface {
    name = 'ModifyAccountBalanceToUseDecimalPrecision1724864348005'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beneficiary_bank_account" ALTER COLUMN "starting_balance" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "beneficiary_bank_account" ALTER COLUMN "account_balance" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "user_bank_account" ALTER COLUMN "account_balance" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ALTER COLUMN "funds_transferred" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ALTER COLUMN "conversion_rate" TYPE numeric(18,4)`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ALTER COLUMN "conversion_amount" TYPE numeric(18,2)`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ALTER COLUMN "bank_charges" TYPE numeric(18,2)`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" ALTER COLUMN "bank_charges" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ALTER COLUMN "conversion_amount" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ALTER COLUMN "conversion_rate" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ALTER COLUMN "funds_transferred" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "user_bank_account" ALTER COLUMN "account_balance" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "beneficiary_bank_account" ALTER COLUMN "account_balance" TYPE double precision`);
        await queryRunner.query(`ALTER TABLE "beneficiary_bank_account" ALTER COLUMN "starting_balance" TYPE integer USING "starting_balance"::integer`);
    }

}
