import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateRolesTable1605240329001 implements MigrationInterface {
  private readonly tableName = "Roles";

  public async up(queryRunner: QueryRunner) {
    return queryRunner.createTable(
      new Table({
        name: this.tableName,
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
            isNullable: false,
            isUnique: true
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropTable(this.tableName);
  }
}
