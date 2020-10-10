import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateDummiesTable1602283377060 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.createTable(new Table({
      name: "Dummies",
      columns: [
        {
          name: "uuid",
          type: "uuid",
          isPrimary: true,
          isNullable: false,
          default: ""
        },
        {
          name: "welcomeMessage",
          type: "varchar",
          isNullable: false
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.dropTable("Dummies");
  }
}
