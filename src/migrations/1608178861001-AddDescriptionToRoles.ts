import { Table, MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDescriptionToRoles1608178861001 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    return queryRunner.addColumn(
      new Table({ name: "Roles" }),
      new TableColumn({
        name: "description",
        type: "varchar",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropColumn("Roles", "description");
  }
}
