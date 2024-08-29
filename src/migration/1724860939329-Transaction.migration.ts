import { MigrationInterface, QueryRunner } from "typeorm";

export class Transaction1724860939329 implements MigrationInterface {
    name = 'Transaction1724860939329'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."transaction_entity_transaction_status_enum" AS ENUM('PENDING', 'COMPLETED', 'FAILED')`);
        await queryRunner.query(`CREATE TABLE "transaction_entity" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "transaction_reference" character varying NOT NULL, "funds_transferred" double precision NOT NULL, "currency" character varying NOT NULL, "amount" character varying NOT NULL, "conversion_rate" double precision, "conversion_amount" double precision, "transaction_type" character varying NOT NULL DEFAULT 'DEBIT', "transaction_status" "public"."transaction_entity_transaction_status_enum" NOT NULL DEFAULT 'PENDING', "description" character varying, "bank_charges" double precision, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "userInfoId" uuid, "userBankAccountId" uuid, "beneficiaryBankAccountId" uuid, CONSTRAINT "PK_6f9d7f02d8835ac9ef1f685a2e8" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_75d492b5679af38c09aa79897ad" FOREIGN KEY ("userInfoId") REFERENCES "user_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_76818bed4dc94ef9cf08df8a428" FOREIGN KEY ("userBankAccountId") REFERENCES "user_bank_account"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" ADD CONSTRAINT "FK_fcc8680146afa0b3b2a73ace207" FOREIGN KEY ("beneficiaryBankAccountId") REFERENCES "beneficiary_bank_account"("id") ON DELETE CASCADE ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_fcc8680146afa0b3b2a73ace207"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_76818bed4dc94ef9cf08df8a428"`);
        await queryRunner.query(`ALTER TABLE "transaction_entity" DROP CONSTRAINT "FK_75d492b5679af38c09aa79897ad"`);
        await queryRunner.query(`DROP TABLE "transaction_entity"`);
        await queryRunner.query(`DROP TYPE "public"."transaction_entity_transaction_status_enum"`);
    }

}
