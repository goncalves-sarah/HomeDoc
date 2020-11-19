import {MigrationInterface, QueryRunner, Table} from "typeorm";

export class createDoctors1602958841135 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.createTable(new Table({
            name: 'doctors',
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
                    name: 'birthDate',
                    type: 'datetime',
                },
                {
                    name: 'email',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'cellphone',
                    type: 'varchar',
                },
                {
                    name: 'crm',
                    type: 'varchar',
                    isUnique: true
                },
                {
                    name: 'specialty',
                    type: 'varchar',
                },
                {
                    name: 'about',
                    type: 'text',
                    isNullable: true
                },
                {
                    name: 'city',
                    type: 'varchar',
                },
                {
                    name: 'consult_price',
                    type: 'varchar',
                },
                {
                    name: 'password',
                    type: 'varchar',
                },
            ]
        }));
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.dropTable('doctors');
    }

}
