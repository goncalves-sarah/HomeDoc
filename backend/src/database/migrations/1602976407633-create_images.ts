import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createImages1602976407633 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'images',
            columns: [
                {
                    name: 'id',
                    type: 'integer',
                    unsigned: true,
                    isPrimary: true,
                    isGenerated: true,
                    generationStrategy: 'increment'
                },
                {
                    name: 'name',
                    type: 'varchar',
                },
                {
                    name: 'size',
                    type: 'decimal',
                },
                {
                    name: 'url',
                    type: 'varchar',
                },
                {
                    name: 'key',
                    type: 'varchar',
                },
                {
                    name: 'isAvatar',
                    type: 'boolean',
                },
                {
                    name: 'doctorId',
                    type: 'integer',
                    isNullable: true
                },
                {
                    name: 'patientId',
                    type: 'integer',
                    isNullable: true
                },
            ],
            foreignKeys: [
                {
                    name: 'DocImage',
                    columnNames: ['doctorId'],
                    referencedTableName: 'doctors',
                    referencedColumnNames: ['id'],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                },
                {
                    name: 'PatImage',
                    columnNames: ['patientId'],
                    referencedTableName: 'patients',
                    referencedColumnNames: ['id'],
                    onUpdate: 'CASCADE',
                    onDelete: 'CASCADE'
                }
            ]
        }))
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('images');
    }

}
