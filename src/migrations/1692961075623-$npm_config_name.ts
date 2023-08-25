import { MigrationInterface, QueryRunner } from 'typeorm';

export class $npmConfigName1692961075623 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "post" ADD COLUMN "mime" VARCHAR(50) NOT NULL DEFAULT 'unknown'`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`ALTER TABLE "post" DROP COLUMN "mime"`);
  }
}
