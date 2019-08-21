import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1566159066024 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "slackUser" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL, "slackUserId" nvarchar(255) NOT NULL, "slackWorkspaceId" nvarchar(255) NOT NULL, CONSTRAINT "PK_d719546a0259abf6bdfc6f03596" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "egg" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL, "didHatch" bit NOT NULL, "laidByChickenId" int NOT NULL, "ownedByUserId" int NOT NULL, "givenByUserId" int, CONSTRAINT "PK_2dc640b239cab7f251d7141e435" PRIMARY KEY ("id"))`);
        await queryRunner.query(`CREATE TABLE "chicken" ("id" int NOT NULL IDENTITY(1,1), "isActive" bit NOT NULL, "name" nvarchar(255) NOT NULL, "lastFedDate" datetime NOT NULL, "growthState" int NOT NULL, "awaitingRename" bit NOT NULL, "ownedByUserId" int, CONSTRAINT "PK_1cb4ebaee92f7a92df421925a2a" PRIMARY KEY ("id"))`);
        await queryRunner.query(`ALTER TABLE "egg" ADD CONSTRAINT "FK_924c7114e166a7de87ce4c446b3" FOREIGN KEY ("laidByChickenId") REFERENCES "chicken"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "egg" ADD CONSTRAINT "FK_43651b1827f25d2760321963a53" FOREIGN KEY ("ownedByUserId") REFERENCES "slackUser"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "egg" ADD CONSTRAINT "FK_2ca66dbd947b993668a8440a87d" FOREIGN KEY ("givenByUserId") REFERENCES "slackUser"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "chicken" ADD CONSTRAINT "FK_3d7b5ed2332525cebf00a2495dc" FOREIGN KEY ("ownedByUserId") REFERENCES "slackUser"("id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "chicken" DROP CONSTRAINT "FK_3d7b5ed2332525cebf00a2495dc"`);
        await queryRunner.query(`ALTER TABLE "egg" DROP CONSTRAINT "FK_2ca66dbd947b993668a8440a87d"`);
        await queryRunner.query(`ALTER TABLE "egg" DROP CONSTRAINT "FK_43651b1827f25d2760321963a53"`);
        await queryRunner.query(`ALTER TABLE "egg" DROP CONSTRAINT "FK_924c7114e166a7de87ce4c446b3"`);
        await queryRunner.query(`DROP TABLE "chicken"`);
        await queryRunner.query(`DROP TABLE "egg"`);
        await queryRunner.query(`DROP TABLE "slackUser"`);
    }

}
