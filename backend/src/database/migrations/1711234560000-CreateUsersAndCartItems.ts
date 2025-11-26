import { MigrationInterface, QueryRunner } from 'typeorm';

export class CreateUsersAndCartItems1711234560000 implements MigrationInterface {
  name = 'CreateUsersAndCartItems1711234560000';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('CREATE EXTENSION IF NOT EXISTS "uuid-ossp"');

    await queryRunner.query(`
      CREATE TABLE "users" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "email" character varying NOT NULL,
        "password" character varying NOT NULL,
        "name" character varying,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_users_id" PRIMARY KEY ("id"),
        CONSTRAINT "UQ_users_email" UNIQUE ("email")
      )
    `);

    await queryRunner.query(`
      CREATE TABLE "cart_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "book_id" character varying NOT NULL,
        "title" character varying NOT NULL,
        "author" character varying,
        "cover_url" character varying,
        "price" numeric(10,2) NOT NULL,
        "quantity" integer NOT NULL DEFAULT 1,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_cart_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_cart_items_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `);

    await queryRunner.query(
      'CREATE UNIQUE INDEX "IDX_cart_items_user_book" ON "cart_items" ("user_id", "book_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_cart_items_user" ON "cart_items" ("user_id")',
    );
    await queryRunner.query(
      'CREATE INDEX "IDX_cart_items_book" ON "cart_items" ("book_id")',
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_cart_items_book"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_cart_items_user"');
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_cart_items_user_book"');
    await queryRunner.query('DROP TABLE "cart_items"');
    await queryRunner.query('DROP TABLE "users"');
  }
}
