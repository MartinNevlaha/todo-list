import { MigrationInterface, QueryRunner } from 'typeorm';

export class Initial1705841589964 implements MigrationInterface {
  name = 'Initial1705841589964';

  public async up(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `CREATE TABLE "task" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying(100) NOT NULL, "text" text NOT NULL, "deadline" TIMESTAMP WITH TIME ZONE NOT NULL, "creator" character varying NOT NULL, "status" character varying NOT NULL, "todoId" uuid, CONSTRAINT "PK_fb213f79ee45060ba925ecd576e" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "todo_list" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "title" character varying NOT NULL, CONSTRAINT "PK_1a5448d48035763b9dbab86555b" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user" ("id" uuid NOT NULL DEFAULT uuid_generate_v4(), "email" character varying NOT NULL, "password" character varying NOT NULL, CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "UQ_e12875dfb3b1d92d7d7c5377e22" UNIQUE ("email"), CONSTRAINT "PK_cace4a159ff9f2512dd42373760" PRIMARY KEY ("id"))`,
    );
    await queryRunner.query(
      `CREATE TABLE "user_todo_lists_todo_list" ("userId" uuid NOT NULL, "todoListId" uuid NOT NULL, CONSTRAINT "PK_32a7f9dfc2a052aeef605f065b1" PRIMARY KEY ("userId", "todoListId"))`,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_70d86c497b8524f37bf420fa1d" ON "user_todo_lists_todo_list" ("userId") `,
    );
    await queryRunner.query(
      `CREATE INDEX "IDX_59975e9c788f59c227e4c61db4" ON "user_todo_lists_todo_list" ("todoListId") `,
    );
    await queryRunner.query(
      `ALTER TABLE "task" ADD CONSTRAINT "FK_91440d017e7b30d2ac16a27d762" FOREIGN KEY ("todoId") REFERENCES "todo_list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_todo_lists_todo_list" ADD CONSTRAINT "FK_70d86c497b8524f37bf420fa1d5" FOREIGN KEY ("userId") REFERENCES "user"("id") ON DELETE CASCADE ON UPDATE CASCADE`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_todo_lists_todo_list" ADD CONSTRAINT "FK_59975e9c788f59c227e4c61db43" FOREIGN KEY ("todoListId") REFERENCES "todo_list"("id") ON DELETE CASCADE ON UPDATE NO ACTION`,
    );
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    await queryRunner.query(
      `ALTER TABLE "user_todo_lists_todo_list" DROP CONSTRAINT "FK_59975e9c788f59c227e4c61db43"`,
    );
    await queryRunner.query(
      `ALTER TABLE "user_todo_lists_todo_list" DROP CONSTRAINT "FK_70d86c497b8524f37bf420fa1d5"`,
    );
    await queryRunner.query(
      `ALTER TABLE "task" DROP CONSTRAINT "FK_91440d017e7b30d2ac16a27d762"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_59975e9c788f59c227e4c61db4"`,
    );
    await queryRunner.query(
      `DROP INDEX "public"."IDX_70d86c497b8524f37bf420fa1d"`,
    );
    await queryRunner.query(`DROP TABLE "user_todo_lists_todo_list"`);
    await queryRunner.query(`DROP TABLE "user"`);
    await queryRunner.query(`DROP TABLE "todo_list"`);
    await queryRunner.query(`DROP TABLE "task"`);
  }
}
