import { Table, MigrationInterface, QueryRunner, TableColumn } from "typeorm";

export class AddPronounColumnToVolunteersTable1608235410903 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    return queryRunner.addColumn(
      new Table({ name: "Volunteers" }),
      new TableColumn({
        name: "pronoun",
        type: "varchar",
        isNullable: true
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropColumn("Volunteers", "pronoun");
  }
}
