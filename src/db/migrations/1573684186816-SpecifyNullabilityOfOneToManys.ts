import { MigrationInterface, QueryRunner } from 'typeorm';

export class SpecifyNullabilityOfOneToManys1573684186816
    implements MigrationInterface {
    public name = 'SpecifyNullabilityOfOneToManys1573684186816';

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "egg" ALTER COLUMN "givenOnDate" datetime`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "chicken" DROP CONSTRAINT "FK_3d7b5ed2332525cebf00a2495dc"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "chicken" ALTER COLUMN "ownedByUserId" int NOT NULL`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "chicken" ADD CONSTRAINT "FK_3d7b5ed2332525cebf00a2495dc" FOREIGN KEY ("ownedByUserId") REFERENCES "slackUser"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(
            `ALTER TABLE "chicken" DROP CONSTRAINT "FK_3d7b5ed2332525cebf00a2495dc"`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "chicken" ALTER COLUMN "ownedByUserId" int`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "chicken" ADD CONSTRAINT "FK_3d7b5ed2332525cebf00a2495dc" FOREIGN KEY ("ownedByUserId") REFERENCES "slackUser"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`,
            undefined
        );
        await queryRunner.query(
            `ALTER TABLE "egg" ALTER COLUMN "givenOnDate" datetime NOT NULL`,
            undefined
        );
    }
}
