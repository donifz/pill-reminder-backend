import { MigrationInterface, QueryRunner } from "typeorm";

export class InitialMigration1709250000000 implements MigrationInterface {
    name = 'InitialMigration1709250000000'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`
            CREATE TABLE "user" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "email" character varying NOT NULL,
                "password" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"),
                CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id")
            )
        `);

        await queryRunner.query(`
            CREATE TABLE "medication" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "name" character varying NOT NULL,
                "dosage" character varying NOT NULL,
                "frequency" character varying NOT NULL,
                "time" character varying NOT NULL,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                CONSTRAINT "PK_medication_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_medication_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`DROP TABLE "medication"`);
        await queryRunner.query(`DROP TABLE "user"`);
    }
} 