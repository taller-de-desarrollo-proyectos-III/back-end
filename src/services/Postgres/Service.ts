import { createConnection } from "typeorm";
import { createDatabase, dropDatabase } from "pg-god";
import { parsePostgresUrl } from "pg-god/lib/utils";
import { DatabaseConfig, Environment } from "../../config";
import { Logger } from "../../libs";
import typeOrmConfig from "../../config/TypeORM";
import "reflect-metadata";

export class PostgresService {
  public connect() {
    const config = this.loadConfig();
    return createConnection({ ...config, ...typeOrmConfig });
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

  private loadConfig() {
    if (DatabaseConfig.url === "DATABASE_URL") {
      return { ...DatabaseConfig, url: Environment.database.url() };
    }
    return DatabaseConfig;
  }
}
