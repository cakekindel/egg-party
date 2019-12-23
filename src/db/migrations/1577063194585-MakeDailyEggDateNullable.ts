import { MigrationInterface, QueryRunner } from 'typeorm';

export class MakeDailyEggDateNullable1577063194585
    implements MigrationInterface {
    public name = 'MakeDailyEggDateNullable1577063194585';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "slackUser" ALTER COLUMN "dailyEggsLastRefreshedDate" datetime`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "slackUser" DROP CONSTRAINT "DF_fc4d0bf6070e2272b049a8da2de"`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "slackUser" ADD CONSTRAINT "DF_fc4d0bf6070e2272b049a8da2de" DEFAULT getdate() FOR "dailyEggsLastRefreshedDate"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "slackUser" ALTER COLUMN "dailyEggsLastRefreshedDate" datetime NOT NULL`,
            undefined
        );
    }
}
