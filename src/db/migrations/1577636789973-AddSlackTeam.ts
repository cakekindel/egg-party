import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddSlackTeam1577636789973 implements MigrationInterface {
    public name = 'AddSlackTeam1577636789973';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `CREATE TABLE "slack_team" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL, "createdDate" datetime2 NOT NULL CONSTRAINT "DF_f7c9eb990174b204dc8a1754b94" DEFAULT getdate(), "slack_team_id" nvarchar(255) NOT NULL, "oauth_token" nvarchar(255) NOT NULL, "bot_user_id" nvarchar(255) NOT NULL, CONSTRAINT "PK_c80f54cebf5fa6544a40ec0d186" PRIMARY KEY ("id"))`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "slackUser" ADD "team_id" int NOT NULL`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "slackUser" ADD CONSTRAINT "FK_949f863a6241ecc494bc1d5c293" FOREIGN KEY ("team_id") REFERENCES "slack_team"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "slackUser" DROP CONSTRAINT "FK_949f863a6241ecc494bc1d5c293"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "slackUser" DROP COLUMN "team_id"`,
            undefined
        );
        await queryRunner.query(`DROP TABLE "slack_team"`, undefined);
    }
}
