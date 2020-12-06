import { Table, MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddNotesColumnToVolunteersTable1607282312831 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    return queryRunner.addColumn(
      new Table({ name: "Volunteers" }),
      new TableColumn({
        name: "notes",
        type: "varchar",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropColumn("Volunteers", "notes");
  }
}
