import { MigrationInterface, QueryRunner } from "typeorm";

export class UserInfoAndUserAccountTable1724320514450 implements MigrationInterface {
    name = 'UserInfoAndUserAccountTable1724320514450'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`CREATE TYPE "public"."user_bank_account_account_type_enum" AS ENUM('CURRENT', 'SAVINGS', 'DOMICILIARY')`);
        await queryRunner.query(`CREATE TABLE "user_bank_account" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "account_name" character varying NOT NULL, "account_number" character varying NOT NULL, "account_balance" double precision NOT NULL, "currency" character varying NOT NULL, "amount" character varying, "account_type" "public"."user_bank_account_account_type_enum" NOT NULL DEFAULT 'CURRENT', "bank_name" character varying NOT NULL, "country" character varying NOT NULL DEFAULT 'nigeria', "taxExempt" boolean NOT NULL DEFAULT false, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), "user_id" uuid, CONSTRAINT "REL_519c1ee3262c1e472eb8b57d68" UNIQUE ("user_id"), CONSTRAINT "PK_080d426b06188408bc1cc508c84" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TYPE "public"."user_info_role_enum" AS ENUM('SUPER-ADMIN', 'ADMIN', 'USER')`);
        await queryRunner.query(`CREATE TYPE "public"."user_info_verification_status_enum" AS ENUM('VERIFIED', 'UNVERIFIED')`);
        await queryRunner.query(`CREATE TABLE "user_info" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "first_name" character varying NOT NULL, "last_name" character varying NOT NULL, "full_name" character varying NOT NULL, "email" character varying NOT NULL, "password" character varying NOT NULL, "role" "public"."user_info_role_enum" NOT NULL DEFAULT 'USER', "phone_number" character varying NOT NULL DEFAULT '', "nationality" character varying NOT NULL DEFAULT 'nigerian', "home_address" character varying NOT NULL DEFAULT '', "state_of_residence" character varying NOT NULL DEFAULT '', "country_of_residence" character varying NOT NULL DEFAULT 'nigeria', "gender" character varying NOT NULL, "date_of_birth" date NOT NULL, "age" integer, "verification_status" "public"."user_info_verification_status_enum" NOT NULL DEFAULT 'UNVERIFIED', "otp" integer NOT NULL, "createdAt" TIMESTAMP NOT NULL DEFAULT now(), "updatedAt" TIMESTAMP NOT NULL DEFAULT now(), CONSTRAINT "UQ_75798a41b0aaf7b5575094217d3" UNIQUE ("email"), CONSTRAINT "UQ_f31fc9c6bb31fd7e50dbe00d98e" UNIQUE ("phone_number"), CONSTRAINT "PK_273a06d6cdc2085ee1ce7638b24" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "user_bank_account" ADD CONSTRAINT "FK_519c1ee3262c1e472eb8b57d68d" FOREIGN KEY ("user_id") REFERENCES "user_info"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "user_bank_account" DROP CONSTRAINT "FK_519c1ee3262c1e472eb8b57d68d"`);
        await queryRunner.query(`DROP TABLE "user_info"`);
        await queryRunner.query(`DROP TYPE "public"."user_info_verification_status_enum"`);
        await queryRunner.query(`DROP TYPE "public"."user_info_role_enum"`);
        await queryRunner.query(`DROP TABLE "user_bank_account"`);
        await queryRunner.query(`DROP TYPE "public"."user_bank_account_account_type_enum"`);
    }

}
