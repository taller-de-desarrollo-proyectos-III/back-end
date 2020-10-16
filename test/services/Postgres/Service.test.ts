import { PostgresService } from "../../../src/services";
import { DatabaseConfig, Environment } from "../../../src/config";
import * as typeorm from "typeorm";
import * as pgGod from "pg-god";
import { Logger } from "../../../src/libs";

describe("PostgresService", () => {
  it("connects to the database", async () => {
    const createConnection = jest.fn();
    jest.spyOn(typeorm, "createConnection").mockImplementationOnce(createConnection);
    await new PostgresService(DatabaseConfig).connect();
    expect(createConnection.mock.calls).toHaveLength(1);
  });

  it("connects to the database with the test credentials and typeorm config", async () => {
    const createConnection = jest.fn();
    jest.spyOn(typeorm, "createConnection").mockImplementationOnce(createConnection);
    await new PostgresService({ type: "postgres", url: "urlTest" }).connect();
    expect(createConnection.mock.calls).toMatchObject([[{
      type: "postgres",
      url: "urlTest",
      entities: expect.any(Array)
    }]]);
  });

  it("requests the database url from the environment variable in travis", async () => {
    jest.spyOn(Environment.database, "url").mockImplementation(() => "someURL");
    const createConnection = jest.fn();
    jest.spyOn(typeorm, "createConnection").mockImplementation(createConnection);
    const postgresService = new PostgresService({ type: "postgres", url: "DATABASE_URL" });
    await postgresService.connect();
    expect(createConnection.mock.calls).toMatchObject([[{
      ...DatabaseConfig,
      url: "someURL"
    }]]);
  });

  it("creates the database with the correct credentials", async () => {
    jest.spyOn(Logger, "info").mockImplementationOnce(jest.fn());
    const createDatabase = jest.fn();
    jest.spyOn(pgGod, "createDatabase").mockImplementationOnce(createDatabase);
    await new PostgresService({
      url: "postgres://postgres:postgres@localhost:5433/test",
      type: "postgres"
    }).createDatabase();
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
    await expect(new PostgresService(DatabaseConfig).createDatabase()).rejects.toThrow("ERROR");
  });

  it("drops the database with the correct credentials", async () => {
    jest.spyOn(Logger, "info").mockImplementationOnce(jest.fn());
    const dropDatabase = jest.fn();
    jest.spyOn(pgGod, "dropDatabase").mockImplementationOnce(dropDatabase);
    await new PostgresService({
      url: "postgres://postgres:postgres@localhost:5433/test",
      type: "postgres" as "postgres"
    }).dropDatabase();
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
    await expect(new PostgresService(DatabaseConfig).dropDatabase()).rejects.toThrow("ERROR");
  });
});
