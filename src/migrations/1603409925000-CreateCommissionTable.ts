import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateCommissionTable1603409925000 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    return queryRunner.createTable(
      new Table({
        name: "Commissions",
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
            isNullable: false
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropTable("Commissions");
  }
}
