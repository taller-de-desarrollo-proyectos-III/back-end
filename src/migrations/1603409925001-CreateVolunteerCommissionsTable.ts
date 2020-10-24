import { MigrationInterface, QueryRunner, Table, TableForeignKey } from "typeorm";

export class CreateVolunteerCommissionsTable1603409925001 implements MigrationInterface {
  private readonly tableName = "VolunteerCommissions";

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
          name: "commissionUuid",
          type: "uuid",
          isNullable: false
        }
      ]
    });
    await queryRunner.createTable(table);
    await queryRunner.createForeignKey(table, new TableForeignKey({
      columnNames: ["volunteerUuid"],
      referencedColumnNames: ["uuid"],
      referencedTableName: "Volunteers",
      onDelete: "CASCADE"
    }));
    await queryRunner.createForeignKey(table, new TableForeignKey({
      columnNames: ["commissionUuid"],
      referencedColumnNames: ["uuid"],
      referencedTableName: "Commissions",
      onDelete: "CASCADE"
    }));
    await queryRunner.createPrimaryKey(table, ["volunteerUuid", "commissionUuid"]);
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropTable(this.tableName);
  }
}
