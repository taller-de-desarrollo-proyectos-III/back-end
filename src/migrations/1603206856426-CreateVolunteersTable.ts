import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVolunteersTable1603206856426 implements MigrationInterface {
  public async up(queryRunner: QueryRunner): Promise<void> {
    return queryRunner.createTable(new Table({
      name: "Volunteers",
      columns: [
        {
          name: "uuid",
          type: "uuid",
          isPrimary: true,
          isNullable: false
        },
        {
          name: "dni",
          type: "varchar",
          isNullable: false
        },
        {
          name: "name",
          type: "varchar",
          isNullable: false
        },
        {
          name: "surname",
          type: "varchar",
          isNullable: false
        }
      ]
    }));
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropTable("Volunteers");
  }
}
