import { MigrationInterface, QueryRunner } from "typeorm";

export class RemoveDuplicateDoctorCategories1746470436448 implements MigrationInterface {
    name = 'RemoveDuplicateDoctorCategories1746470436448'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_categories" DROP CONSTRAINT "FK_3c7c2184b85e71a400e7e4c514a"`);
        await queryRunner.query(`ALTER TABLE "doctor_categories" DROP COLUMN "parentId"`);
        await queryRunner.query(`ALTER TABLE "doctor_categories" ADD CONSTRAINT "UQ_e7389aca7512c96d01cff37ee28" UNIQUE ("name")`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "doctor_categories" DROP CONSTRAINT "UQ_e7389aca7512c96d01cff37ee28"`);
        await queryRunner.query(`ALTER TABLE "doctor_categories" ADD "parentId" uuid`);
        await queryRunner.query(`ALTER TABLE "doctor_categories" ADD CONSTRAINT "FK_3c7c2184b85e71a400e7e4c514a" FOREIGN KEY ("parentId") REFERENCES "doctor_categories"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

}
