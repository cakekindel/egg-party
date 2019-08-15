import {MigrationInterface, QueryRunner} from "typeorm";

export class InitialMigration1565799758072 implements MigrationInterface {

    public async up(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`CREATE TABLE "SlackUser" ("Id" int NOT NULL IDENTITY(1,1), "IsActive" bit NOT NULL, "SlackUserId" nvarchar(255) NOT NULL, "SlackWorkspaceId" nvarchar(255) NOT NULL, CONSTRAINT "PK_9f351002567f350bde7a055b111" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "Egg" ("Id" int NOT NULL IDENTITY(1,1), "IsActive" bit NOT NULL, "DidHatch" bit NOT NULL, "LaidByChickenId" int NOT NULL, "OwnedByUserId" int NOT NULL, "GivenByUserId" int, CONSTRAINT "PK_751b56473cf61c3fd92d878696d" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`CREATE TABLE "Chicken" ("Id" int NOT NULL IDENTITY(1,1), "IsActive" bit NOT NULL, "Name" nvarchar(255) NOT NULL, "LastFedDate" datetime NOT NULL, "GrowthState" int NOT NULL, "Gender" int NOT NULL, "OwnedByUserId" int, CONSTRAINT "PK_b429b0f43561694778130694119" PRIMARY KEY ("Id"))`);
        await queryRunner.query(`ALTER TABLE "Egg" ADD CONSTRAINT "FK_8ad9315252bdb129bcd12623206" FOREIGN KEY ("LaidByChickenId") REFERENCES "Chicken"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Egg" ADD CONSTRAINT "FK_8c8497e8674834ff40840d99aea" FOREIGN KEY ("OwnedByUserId") REFERENCES "SlackUser"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Egg" ADD CONSTRAINT "FK_b73ee2bf23edf577b3d497098af" FOREIGN KEY ("GivenByUserId") REFERENCES "SlackUser"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
        await queryRunner.query(`ALTER TABLE "Chicken" ADD CONSTRAINT "FK_9078baea604cd4703202d235fd5" FOREIGN KEY ("OwnedByUserId") REFERENCES "SlackUser"("Id") ON DELETE NO ACTION ON UPDATE NO ACTION`);
    }

    public async down(queryRunner: QueryRunner): Promise<any> {
        await queryRunner.query(`ALTER TABLE "Chicken" DROP CONSTRAINT "FK_9078baea604cd4703202d235fd5"`);
        await queryRunner.query(`ALTER TABLE "Egg" DROP CONSTRAINT "FK_b73ee2bf23edf577b3d497098af"`);
        await queryRunner.query(`ALTER TABLE "Egg" DROP CONSTRAINT "FK_8c8497e8674834ff40840d99aea"`);
        await queryRunner.query(`ALTER TABLE "Egg" DROP CONSTRAINT "FK_8ad9315252bdb129bcd12623206"`);
        await queryRunner.query(`DROP TABLE "Chicken"`);
        await queryRunner.query(`DROP TABLE "Egg"`);
        await queryRunner.query(`DROP TABLE "SlackUser"`);
    }

}
