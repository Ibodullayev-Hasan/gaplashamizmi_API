import { MigrationInterface, QueryRunner } from "typeorm";

export class AddIsOnlineField1752399448556 implements MigrationInterface {
    name = 'AddIsOnlineField1752399448556'

    public async up(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" ADD "is_online" boolean NOT NULL DEFAULT false`);
    }

    public async down(queryRunner: QueryRunner): Promise<void> {
        await queryRunner.query(`ALTER TABLE "users" DROP COLUMN "is_online"`);
    }

}
