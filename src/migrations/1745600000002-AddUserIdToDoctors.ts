import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserIdToDoctors1745600000002 implements MigrationInterface {
  name = 'AddUserIdToDoctors1745600000002';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add userId column to doctors table
    await queryRunner.query(`
      ALTER TABLE "doctors" 
      ADD COLUMN "userId" uuid,
      ADD CONSTRAINT "FK_doctors_user" 
      FOREIGN KEY ("userId") REFERENCES "users"("id") ON DELETE SET NULL
    `);

    // Add index for better performance
    await queryRunner.query(`
      CREATE INDEX "IDX_doctors_user" ON "doctors" ("userId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop index
    await queryRunner.query(`DROP INDEX "IDX_doctors_user"`);

    // Drop foreign key constraint
    await queryRunner.query(`
      ALTER TABLE "doctors" 
      DROP CONSTRAINT "FK_doctors_user"
    `);

    // Drop column
    await queryRunner.query(`
      ALTER TABLE "doctors" 
      DROP COLUMN "userId"
    `);
  }
}
