import { MigrationInterface, QueryRunner } from 'typeorm';

export class EntityBaseSnakeCasing1580744997079 implements MigrationInterface {
    public name = 'EntityBaseSnakeCasing1580744997079';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `EXEC sp_rename 'slackUser.isActive', 'is_active', 'COLUMN'`,
            undefined
        );
        await queryRunner.query(
            `EXEC sp_rename 'slackUser.createdDate', 'created_date', 'COLUMN'`,
            undefined
        );
        await queryRunner.query(
            `EXEC sp_rename 'egg.isActive', 'is_active', 'COLUMN'`,
            undefined
        );
        await queryRunner.query(
            `EXEC sp_rename 'egg.createdDate', 'created_date', 'COLUMN'`,
            undefined
        );
        await queryRunner.query(
            `EXEC sp_rename 'chicken.isActive', 'is_active', 'COLUMN'`,
            undefined
        );
        await queryRunner.query(
            `EXEC sp_rename 'chicken.createdDate', 'created_date', 'COLUMN'`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `EXEC sp_rename 'slackUser.is_active', 'isActive', 'COLUMN'`,
            undefined
        );
        await queryRunner.query(
            `EXEC sp_rename 'slackUser.created_date', 'createdDate', 'COLUMN'`,
            undefined
        );
        await queryRunner.query(
            `EXEC sp_rename 'egg.is_active', 'isActive', 'COLUMN'`,
            undefined
        );
        await queryRunner.query(
            `EXEC sp_rename 'egg.created_date', 'createdDate', 'COLUMN'`,
            undefined
        );
        await queryRunner.query(
            `EXEC sp_rename 'chicken.is_active', 'isActive', 'COLUMN'`,
            undefined
        );
        await queryRunner.query(
            `EXEC sp_rename 'chicken.created_date', 'createdDate', 'COLUMN'`,
            undefined
        );
    }
}
