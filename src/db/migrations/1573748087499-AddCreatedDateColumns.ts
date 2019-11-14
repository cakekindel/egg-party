import {MigrationInterface, QueryRunner} from "typeorm";

export class AddCreatedDateColumns1573748087499 implements MigrationInterface {
    name = 'AddCreatedDateColumns1573748087499'

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "slackUser" ADD "createdDate" datetime2 NOT NULL CONSTRAINT "DF_5552d643143f9d76ec3366e2764" DEFAULT getdate()`, undefined);
        await queryRunner.query(`ALTER TABLE "egg" ADD "createdDate" datetime2 NOT NULL CONSTRAINT "DF_116c84c8ca56319e2c960e87031" DEFAULT getdate()`, undefined);
        await queryRunner.query(`ALTER TABLE "chicken" ADD "createdDate" datetime2 NOT NULL CONSTRAINT "DF_fc4b395c0983ede3d8b3b93f6ff" DEFAULT getdate()`, undefined);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "chicken" DROP CONSTRAINT "DF_fc4b395c0983ede3d8b3b93f6ff"`, undefined);
        await queryRunner.query(`ALTER TABLE "chicken" DROP COLUMN "createdDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "egg" DROP CONSTRAINT "DF_116c84c8ca56319e2c960e87031"`, undefined);
        await queryRunner.query(`ALTER TABLE "egg" DROP COLUMN "createdDate"`, undefined);
        await queryRunner.query(`ALTER TABLE "slackUser" DROP CONSTRAINT "DF_5552d643143f9d76ec3366e2764"`, undefined);
        await queryRunner.query(`ALTER TABLE "slackUser" DROP COLUMN "createdDate"`, undefined);
    }

}
