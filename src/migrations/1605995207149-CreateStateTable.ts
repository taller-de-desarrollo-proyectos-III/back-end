import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateStatesTable1605995207149 implements MigrationInterface {
  private readonly tableName = "States";

  public async up(queryRunner: QueryRunner) {
    return queryRunner.createTable(
      new Table({
        name: this.tableName,
        columns: [
          {
            name: "uuid",
            type: "uuid",
            isPrimary: true,
            isNullable: false
          },
          {
            name: "name",
            type: "varchar",
            isNullable: false,
            isUnique: true
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropTable(this.tableName);
  }
}
