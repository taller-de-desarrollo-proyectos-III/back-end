import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateVolunteerRolesTable1605995207148 implements MigrationInterface {
  private readonly tableName = "VolunteerRoles";

  public async up(queryRunner: QueryRunner) {
    const table = new Table({
      name: this.tableName,
      columns: [
        {
          name: "volunteerUuid",
          type: "uuid",
          isNullable: false
        },
        {
          name: "roleUuid",
          type: "uuid",
          isNullable: false
        }
      ]
    });
    await queryRunner.createTable(table);
    await queryRunner.createForeignKey(
      table,
      new TableForeignKey({
        columnNames: ["volunteerUuid"],
        referencedColumnNames: ["uuid"],
        referencedTableName: "Volunteers",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createForeignKey(
      table,
      new TableForeignKey({
        columnNames: ["roleUuid"],
        referencedColumnNames: ["uuid"],
        referencedTableName: "Roles",
        onDelete: "CASCADE"
      })
    );
    await queryRunner.createPrimaryKey(table, ["volunteerUuid", "roleUuid"]);
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropTable(this.tableName);
  }
}
