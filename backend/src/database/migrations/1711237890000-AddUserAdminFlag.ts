import { MigrationInterface, QueryRunner } from 'typeorm';

export class AddUserAdminFlag1711237890000 implements MigrationInterface {
  name = 'AddUserAdminFlag1711237890000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      'ALTER TABLE "users" ADD COLUMN IF NOT EXISTS "is_admin" boolean NOT NULL DEFAULT false',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('ALTER TABLE "users" DROP COLUMN IF EXISTS "is_admin"');
  }
}
