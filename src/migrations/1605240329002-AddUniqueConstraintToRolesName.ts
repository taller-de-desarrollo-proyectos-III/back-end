import { Table, MigrationInterface, QueryRunner } from "typeorm";
import { TableUnique } from "typeorm/schema-builder/table/TableUnique";

export class AddUniqueConstraintToRolesName1605240329002 implements MigrationInterface {
  private readonly constraintName = "RolesNameKey";

  public async up(queryRunner: QueryRunner) {
    return queryRunner.createUniqueConstraint(
      new Table({ name: "Roles" }),
      new TableUnique({
        name: this.constraintName,
        columnNames: ["name"]
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropUniqueConstraint("Roles", this.constraintName);
  }
}
