import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserRoles1745600000001 implements MigrationInterface {
  name = 'AddUserRoles1745600000001';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create enum type
    await queryRunner.query(`
      CREATE TYPE "public"."user_role_enum" AS ENUM('admin', 'user', 'doctor')
    `);

    // Add role column with default value
    await queryRunner.query(`
      ALTER TABLE "users" 
      ADD COLUMN "role" "public"."user_role_enum" NOT NULL DEFAULT 'user'
    `);

    // Create an admin user if none exists
    await queryRunner.query(`
      INSERT INTO "users" ("name", "email", "password", "role", "createdAt", "updatedAt")
      SELECT 'Admin', 'admin@example.com', '$2b$10$YourHashedPasswordHere', 'admin', NOW(), NOW()
      WHERE NOT EXISTS (
        SELECT 1 FROM "users" WHERE "role" = 'admin'
      )
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Remove role column
    await queryRunner.query(`
      ALTER TABLE "users" DROP COLUMN "role"
    `);

    // Drop enum type
    await queryRunner.query(`
      DROP TYPE "public"."user_role_enum"
    `);
  }
}
