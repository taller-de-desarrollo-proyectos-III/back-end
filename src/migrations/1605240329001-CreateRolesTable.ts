import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRolesTable1605240329001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    return queryRunner.createTable(
      new Table({
        name: "Roles",
        columns: [
          {
            name: "uuid",
            type: "uuid",
            isPrimary: true,
            isNullable: false
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropTable("Roles");
  }
}
