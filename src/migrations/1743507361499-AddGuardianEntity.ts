import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddGuardianEntity1743507361499 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
            CREATE TABLE "guardian" (
                "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
                "isAccepted" boolean NOT NULL DEFAULT false,
                "invitationToken" character varying,
                "invitationExpiresAt" TIMESTAMP,
                "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
                "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
                "userId" uuid NOT NULL,
                "guardianId" uuid NOT NULL,
                CONSTRAINT "PK_guardian_id" PRIMARY KEY ("id"),
                CONSTRAINT "FK_guardian_user" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE,
                CONSTRAINT "FK_guardian_guardian" FOREIGN KEY ("guardianId") REFERENCES "user"("id") ON DELETE CASCADE
            )
        `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`DROP TABLE "guardian"`);
  }
}
