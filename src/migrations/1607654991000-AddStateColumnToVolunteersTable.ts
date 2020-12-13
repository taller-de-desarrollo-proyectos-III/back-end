import { Table, MigrationInterface, QueryRunner, TableColumn, TableForeignKey } from "typeorm";

export class AddStateColumnToVolunteersTable1607654991000 implements MigrationInterface {
  private readonly columnName = "stateUuid";

  public async up(queryRunner: QueryRunner) {
    const table = new Table({ name: "Volunteers" });
    await queryRunner.addColumn(table, new TableColumn({ name: this.columnName, type: "uuid" }));
    await queryRunner.createForeignKey(
      table,
      new TableForeignKey({
        columnNames: [this.columnName],
        referencedColumnNames: ["uuid"],
        referencedTableName: "States",
        onDelete: "CASCADE"
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropColumn("Volunteers", this.columnName);
  }
}
