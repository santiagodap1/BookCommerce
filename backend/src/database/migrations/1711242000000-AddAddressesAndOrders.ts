import { MigrationInterface, QueryRunner } from 'typeorm'

export class AddAddressesAndOrders1711242000000 implements MigrationInterface {
  name = 'AddAddressesAndOrders1711242000000'

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "addresses" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "label" character varying NOT NULL,
        "recipient_name" character varying NOT NULL,
        "street" character varying NOT NULL,
        "city" character varying NOT NULL,
        "state" character varying,
        "postal_code" character varying NOT NULL,
        "country" character varying NOT NULL,
        "phone" character varying,
        "is_default" boolean NOT NULL DEFAULT false,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_addresses_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_addresses_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "orders" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "user_id" uuid NOT NULL,
        "status" character varying NOT NULL DEFAULT 'PLACED',
        "total_price" numeric(10,2) NOT NULL,
        "shipping_name" character varying NOT NULL,
        "shipping_street" character varying NOT NULL,
        "shipping_city" character varying NOT NULL,
        "shipping_state" character varying,
        "shipping_postal_code" character varying NOT NULL,
        "shipping_country" character varying NOT NULL,
        "shipping_phone" character varying,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_orders_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_orders_user" FOREIGN KEY ("user_id") REFERENCES "users"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query(`
      CREATE TABLE IF NOT EXISTS "order_items" (
        "id" uuid NOT NULL DEFAULT uuid_generate_v4(),
        "order_id" uuid NOT NULL,
        "book_id" character varying NOT NULL,
        "title" character varying NOT NULL,
        "author" character varying,
        "cover_url" character varying,
        "price" numeric(10,2) NOT NULL,
        "quantity" integer NOT NULL,
        "created_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        "updated_at" TIMESTAMPTZ NOT NULL DEFAULT now(),
        CONSTRAINT "PK_order_items_id" PRIMARY KEY ("id"),
        CONSTRAINT "FK_order_items_order" FOREIGN KEY ("order_id") REFERENCES "orders"("id") ON DELETE CASCADE
      )
    `)

    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_addresses_user" ON "addresses" ("user_id")')
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_orders_user" ON "orders" ("user_id")')
    await queryRunner.query('CREATE INDEX IF NOT EXISTS "IDX_order_items_order" ON "order_items" ("order_id")')
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_order_items_order"')
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_orders_user"')
    await queryRunner.query('DROP INDEX IF EXISTS "IDX_addresses_user"')
    await queryRunner.query('DROP TABLE "order_items"')
    await queryRunner.query('DROP TABLE "orders"')
    await queryRunner.query('DROP TABLE "addresses"')
  }
}
