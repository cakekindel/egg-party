import { MigrationInterface, QueryRunner } from 'typeorm';

export class EggAddGivenOnDate1573419560850 implements MigrationInterface {
    public name = 'EggAddGivenOnDate1573419560850';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "egg" ADD "givenOnDate" datetime NOT NULL`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "egg" DROP COLUMN "givenOnDate"`,
            undefined
        );
    }
}
