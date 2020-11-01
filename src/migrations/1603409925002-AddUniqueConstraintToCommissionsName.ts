import { Table, MigrationInterface, QueryRunner } from "typeorm";
import { TableUnique } from "typeorm/schema-builder/table/TableUnique";

export class AddUniqueConstraintToCommissionsName1603409925002 implements MigrationInterface {
  private readonly constraintName = "CommissionsNameKey";

  public async up(queryRunner: QueryRunner) {
    return queryRunner.createUniqueConstraint(
      new Table({ name: "Commissions" }),
      new TableUnique({
        name: this.constraintName,
        columnNames: ["name"]
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropUniqueConstraint("Commissions", this.constraintName);
  }
}
