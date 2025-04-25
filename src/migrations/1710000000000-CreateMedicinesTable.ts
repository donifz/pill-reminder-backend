import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateMedicinesTable1710000000000 implements MigrationInterface {
    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(
            new Table({
                name: "medicines",
                columns: [
                    {
                        name: "id",
                        type: "uuid",
                        isPrimary: true,
                        generationStrategy: "uuid",
                        default: "uuid_generate_v4()",
                    },
                    {
                        name: "name",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "generic_name",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "manufacturer",
                        type: "varchar",
                        length: "255",
                    },
                    {
                        name: "dosage_forms",
                        type: "text",
                        isArray: true,
                    },
                    {
                        name: "doses",
                        type: "text",
                        isArray: true,
                    },
                    {
                        name: "description",
                        type: "text",
                    },
                    {
                        name: "barcode",
                        type: "varchar",
                        length: "255",
                        isUnique: true,
                    },
                    {
                        name: "country_id",
                        type: "uuid",
                    },
                    {
                        name: "created_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                    {
                        name: "updated_at",
                        type: "timestamp",
                        default: "CURRENT_TIMESTAMP",
                    },
                ],
            }),
            true
        );

        // Add foreign key constraint
        await queryRunner.createForeignKey(
            "medicines",
            new TableForeignKey({
                columnNames: ["country_id"],
                referencedColumnNames: ["id"],
                referencedTableName: "countries",
                onDelete: "CASCADE",
            })
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        const table = await queryRunner.getTable("medicines");
        const foreignKey = table.foreignKeys.find(
            (fk) => fk.columnNames.indexOf("country_id") !== -1
        );
        await queryRunner.dropForeignKey("medicines", foreignKey);
        await queryRunner.dropTable("medicines");
    }
} 