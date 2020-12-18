import { Table, MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddDescriptionToCommissions1608178861000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    return queryRunner.addColumn(
      new Table({ name: "Commissions" }),
      new TableColumn({
        name: "description",
        type: "varchar",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropColumn("Commissions", "description");
  }
}
