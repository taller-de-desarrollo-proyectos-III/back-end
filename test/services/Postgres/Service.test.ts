import { PostgresService } from "../../../src/services";
import { DatabaseConfig, Environment } from "../../../src/config";
import typeOrmConfig from "../../../src/config/TypeORM";
import * as typeorm from "typeorm";
import * as pgGod from "pg-god";
import { Logger } from "../../../src/libs";

describe("PostgresService", () => {
  const postgresService = new PostgresService();

  it("connects to the database", async () => {
    const createConnection = jest.fn();
    jest.spyOn(typeorm, "createConnection").mockImplementationOnce(createConnection);
    await postgresService.connect();
    expect(createConnection.mock.calls).toHaveLength(1);
  });

  it("connects to the database with the test credentials and typeorm config", async () => {
    const createConnection = jest.fn();
    jest.spyOn(typeorm, "createConnection").mockImplementationOnce(createConnection);
    await postgresService.connect();
    expect(createConnection.mock.calls).toEqual([[{
      ...DatabaseConfig,
      ...typeOrmConfig
    }]]);
  });

  it("requests the database url from the environment variable in production", async () => {
    jest.spyOn(Environment, "NODE_ENV").mockImplementationOnce(() => Environment.PRODUCTION);
    jest.spyOn(Environment.database, "url").mockImplementationOnce(() => "someURL");
    const createConnection = jest.fn();
    jest.spyOn(typeorm, "createConnection").mockImplementationOnce(createConnection);
    await postgresService.connect();
    expect(createConnection.mock.calls).toEqual([[{
      ...DatabaseConfig,
      url: "someURL",
      ...typeOrmConfig
    }]]);
  });

  it("creates the database with the correct credentials", async () => {
    jest.spyOn(Logger, "info").mockImplementationOnce(jest.fn());
    const createDatabase = jest.fn();
    jest.spyOn(pgGod, "createDatabase").mockImplementationOnce(createDatabase);
    await postgresService.createDatabase();
    expect(createDatabase.mock.calls).toEqual([[
      {
        databaseName: "test",
        errorIfExist: true
      },
      {
        user: "postgres",
        port: 5433,
        host: "localhost",
        password: "postgres"
      }
    ]]);
  });

  it("throws an error if the createDatabase operation fails", async () => {
    jest.spyOn(Logger, "info").mockImplementationOnce(jest.fn());
    jest.spyOn(Logger, "error").mockImplementationOnce(jest.fn());
    const createDatabase = jest.fn(() => { throw new Error("ERROR"); });
    jest.spyOn(pgGod, "createDatabase").mockImplementationOnce(createDatabase);
    await expect(postgresService.createDatabase()).rejects.toThrow("ERROR");
  });

  it("drops the database with the correct credentials", async () => {
    jest.spyOn(Logger, "info").mockImplementationOnce(jest.fn());
    const dropDatabase = jest.fn();
    jest.spyOn(pgGod, "dropDatabase").mockImplementationOnce(dropDatabase);
    await postgresService.dropDatabase();
    expect(dropDatabase.mock.calls).toEqual([[
      {
        databaseName: "test",
        errorIfNonExist: true
      },
      {
        user: "postgres",
        port: 5433,
        host: "localhost",
        password: "postgres"
      }
    ]]);
  });

  it("throws an error if the dropDatabase operation fails", async () => {
    jest.spyOn(Logger, "info").mockImplementationOnce(jest.fn());
    jest.spyOn(Logger, "error").mockImplementationOnce(jest.fn());
    const dropDatabase = jest.fn(() => { throw new Error("ERROR"); });
    jest.spyOn(pgGod, "dropDatabase").mockImplementationOnce(dropDatabase);
    await expect(postgresService.dropDatabase()).rejects.toThrow("ERROR");
  });
});
