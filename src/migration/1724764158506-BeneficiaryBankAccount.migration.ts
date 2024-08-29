import { MigrationInterface, QueryRunner } from "typeorm";

export class BeneficiaryBankAccount1724764158506 implements MigrationInterface {
    name = 'BeneficiaryBankAccount1724764158506'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."beneficiary_bank_account_account_type_enum" AS ENUM('CURRENT', 'SAVINGS', 'DOMICILIARY')`);
        await queryRunner.query(`CREATE TABLE "beneficiary_bank_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_name" character varying NOT NULL, "account_number" character varying, "starting_balance" integer NOT NULL DEFAULT '0', "account_balance" double precision NOT NULL, "currency" character varying NOT NULL, "amount" character varying, "account_type" "public"."beneficiary_bank_account_account_type_enum" NOT NULL DEFAULT 'CURRENT', "bank_name" character varying NOT NULL, "iban" character varying, "swift_bic" character varying, "country" character varying NOT NULL DEFAULT 'nigeria', "taxExempt" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userInfoId" uuid, "userBankAccountId" uuid, CONSTRAINT "PK_37dfc12a2175c478ae38b5e9f97" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "beneficiary_bank_account" ADD CONSTRAINT "FK_e003231807755483d8b6a1cb3ec" FOREIGN KEY ("userInfoId") REFERENCES "user_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "beneficiary_bank_account" ADD CONSTRAINT "FK_f1026d447e2e146f0c9b1a663b6" FOREIGN KEY ("userBankAccountId") REFERENCES "user_bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "beneficiary_bank_account" DROP CONSTRAINT "FK_f1026d447e2e146f0c9b1a663b6"`);
        await queryRunner.query(`ALTER TABLE "beneficiary_bank_account" DROP CONSTRAINT "FK_e003231807755483d8b6a1cb3ec"`);
        await queryRunner.query(`DROP TABLE "beneficiary_bank_account"`);
        await queryRunner.query(`DROP TYPE "public"."beneficiary_bank_account_account_type_enum"`);
    }

}
