import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddCityFields1710000000000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    // Add city column to users table
    await queryRunner.query(`
      ALTER TABLE "user"
      ADD COLUMN "city" character varying
    `);

    // Add city column to doctors table
    await queryRunner.query(`
      ALTER TABLE "doctors"
      ADD COLUMN "city" character varying
    `);

    // Add city column to pharmacies table
    await queryRunner.query(`
      ALTER TABLE "pharmacies"
      ADD COLUMN "city" character varying
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove city column from users table
    await queryRunner.query(`
      ALTER TABLE "user"
      DROP COLUMN "city"
    `);

    // Remove city column from doctors table
    await queryRunner.query(`
      ALTER TABLE "doctors"
      DROP COLUMN "city"
    `);

    // Remove city column from pharmacies table
    await queryRunner.query(`
      ALTER TABLE "pharmacies"
      DROP COLUMN "city"
    `);
  }
} 