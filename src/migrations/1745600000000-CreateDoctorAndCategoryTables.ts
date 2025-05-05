import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateDoctorAndCategoryTables1745600000000 implements MigrationInterface {
  name = 'CreateDoctorAndCategoryTables1745600000000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    // Create doctor_categories table
    await queryRunner.query(`
      CREATE TABLE "doctor_categories" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "name" character varying NOT NULL,
        "iconUrl" character varying NOT NULL,
        "description" character varying,
        "parentId" uuid,
        CONSTRAINT "PK_doctor_categories" PRIMARY KEY ("id")
      )
    `);

    // Create closure table for doctor categories tree structure
    await queryRunner.query(`
      CREATE TABLE "doctor_categories_closure" (
        "id_ancestor" uuid NOT NULL,
        "id_descendant" uuid NOT NULL,
        CONSTRAINT "PK_doctor_categories_closure" PRIMARY KEY ("id_ancestor","id_descendant"),
        CONSTRAINT "FK_doctor_categories_closure_ancestor" FOREIGN KEY ("id_ancestor") REFERENCES "doctor_categories"("id") ON DELETE CASCADE,
        CONSTRAINT "FK_doctor_categories_closure_descendant" FOREIGN KEY ("id_descendant") REFERENCES "doctor_categories"("id") ON DELETE CASCADE
      )
    `);

    // Create doctors table
    await queryRunner.query(`
      CREATE TABLE "doctors" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "firstName" character varying NOT NULL,
        "lastName" character varying NOT NULL,
        "photoUrl" character varying NOT NULL,
        "specialization" character varying NOT NULL,
        "yearsExperience" integer NOT NULL,
        "rating" decimal(3,2),
        "reviewsCount" integer,
        "bio" text NOT NULL,
        "languages" text[] NOT NULL,
        "consultationFee" decimal(10,2) NOT NULL,
        "contactEmail" character varying NOT NULL,
        "contactPhone" character varying NOT NULL,
        "clinicAddress" character varying NOT NULL,
        "location" jsonb NOT NULL,
        "availableSlots" timestamp[] NOT NULL,
        "createdAt" TIMESTAMP NOT NULL DEFAULT now(),
        "updatedAt" TIMESTAMP NOT NULL DEFAULT now(),
        "categoryId" uuid,
        CONSTRAINT "PK_doctors" PRIMARY KEY ("id"),
        CONSTRAINT "FK_doctors_category" FOREIGN KEY ("categoryId") REFERENCES "doctor_categories"("id") ON DELETE SET NULL
      )
    `);

    // Add indexes
    await queryRunner.query(`
      CREATE INDEX "IDX_doctor_categories_parent" ON "doctor_categories" ("parentId")
    `);
    await queryRunner.query(`
      CREATE INDEX "IDX_doctors_category" ON "doctors" ("categoryId")
    `);
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    // Drop indexes
    await queryRunner.query(`DROP INDEX "IDX_doctors_category"`);
    await queryRunner.query(`DROP INDEX "IDX_doctor_categories_parent"`);

    // Drop tables
    await queryRunner.query(`DROP TABLE "doctors"`);
    await queryRunner.query(`DROP TABLE "doctor_categories_closure"`);
    await queryRunner.query(`DROP TABLE "doctor_categories"`);
  }
} 