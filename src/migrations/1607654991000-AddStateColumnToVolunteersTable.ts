import { Table, MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddStateColumnToVolunteersTable1607654991000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    return queryRunner.addColumn(
      new Table({ name: "Volunteers" }),
      new TableColumn({
        name: "stateUuid",
        type: "uuid"
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropColumn("Volunteers", "stateUuid");
  }
}
