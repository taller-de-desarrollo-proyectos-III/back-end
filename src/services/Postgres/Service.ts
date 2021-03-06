import { createConnection, getConnection } from "typeorm";
import { createDatabase, dropDatabase } from "pg-god";
import { parsePostgresUrl } from "pg-god/lib/utils";
import { Environment } from "../../config";
import { Logger } from "../../libs";
import {
  Volunteer,
  Commission,
  VolunteerCommission,
  Role,
  VolunteerRole,
  State
} from "../../models";
import { IDatabaseConfig } from "./Interfaces";
import "reflect-metadata";

export class PostgresService {
  private readonly databaseConfig: IDatabaseConfig;

  constructor(databaseConfig: IDatabaseConfig) {
    this.databaseConfig = databaseConfig;
  }

  public connect() {
    const config = this.loadConfig();
    return createConnection({
      ...config,
      entities: PostgresService.entities()
    });
  }

  public async closeConnection() {
    const connection = await getConnection();
    return connection.close();
  }

  public async dropDatabase() {
    const { databaseName, ...databaseCredentials } = this.databaseCredentials();
    Logger.info(`Dropping ${databaseName} database`);
    try {
      await dropDatabase({ databaseName, errorIfNonExist: true }, databaseCredentials);
      Logger.info(`Database ${databaseName} dropped`);
    } catch (error) {
      Logger.error(error.message, error);
      throw error;
    }
  }

  public async createDatabase() {
    const { databaseName, ...databaseCredentials } = this.databaseCredentials();
    Logger.info(`Creating ${databaseName} database`);
    try {
      await createDatabase({ databaseName, errorIfExist: true }, databaseCredentials);
      Logger.info(`Database ${databaseName} created`);
    } catch (error) {
      Logger.error(error.message, error);
      throw error;
    }
  }

  private databaseCredentials() {
    const config = this.loadConfig();
    const databaseCredentials = parsePostgresUrl(config.url);
    return {
      databaseName: databaseCredentials.databaseName as string,
      user: databaseCredentials.userName,
      port: Number(databaseCredentials.port),
      host: databaseCredentials.host as any,
      password: databaseCredentials.password
    };
  }

  public loadConfig() {
    if (this.databaseConfig.url === "DATABASE_URL") {
      return { ...this.databaseConfig, url: Environment.database.url() };
    }
    return this.databaseConfig;
  }

  private static entities() {
    return [Volunteer, Commission, VolunteerCommission, Role, VolunteerRole, State];
  }
}
