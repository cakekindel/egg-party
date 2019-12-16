import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddDailyEggsLastRefreshedDate1574016210105
    implements MigrationInterface {
    public name = 'AddDailyEggsLastRefreshedDate1574016210105';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "slackUser" ADD "dailyEggsLastRefreshedDate" datetime NOT NULL CONSTRAINT "DF_fc4d0bf6070e2272b049a8da2de" DEFAULT GETDATE()`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "slackUser" DROP CONSTRAINT "DF_fc4d0bf6070e2272b049a8da2de"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "slackUser" DROP COLUMN "dailyEggsLastRefreshedDate"`,
            undefined
        );
    }
}
