import { MigrationInterface, QueryRunner, Table } from "typeorm";

export class CreateVolunteersTable1603206856426 implements MigrationInterface {
  public async up(queryRunner: QueryRunner) {
    return queryRunner.createTable(
      new Table({
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
          },
          {
            name: "email",
            type: "varchar",
            isNullable: false
          },
          {
            name: "linkedin",
            type: "varchar",
            isNullable: true
          },
          {
            name: "phoneNumber",
            type: "varchar",
            isNullable: false
          },
          {
            name: "telegram",
            type: "varchar",
            isNullable: true
          },
          {
            name: "admissionYear",
            type: "varchar",
            isNullable: true
          },
          {
            name: "graduationYear",
            type: "varchar",
            isNullable: true
          },
          {
            name: "country",
            type: "varchar",
            isNullable: true
          }
        ]
      })
    );
  }

  public async down(queryRunner: QueryRunner) {
    return queryRunner.dropTable("Volunteers");
  }
}
