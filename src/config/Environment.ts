const variablesKeys = {
  NODE_ENV: "NODE_ENV",
  DATABASE_URL: "DATABASE_URL"
};

type Env = "production" | "development" | "test";

export const Environment = {
  PRODUCTION: "production",
  DEVELOPMENT: "development",
  TEST: "test",
  NODE_ENV: () => process.env[variablesKeys.NODE_ENV] as Env || Environment.DEVELOPMENT,
  database: {
    url: () => process.env[variablesKeys.DATABASE_URL] as string
  },
  validEnvironments() {
    return [this.DEVELOPMENT, this.TEST, this.PRODUCTION];
  },
  isLocal() {
    return [this.DEVELOPMENT, this.TEST].includes(this.NODE_ENV());
  },
  validate() {
    if (this.isLocal()) return;

    const mandatoryVariables = [
      { name: variablesKeys.DATABASE_URL, value: this.database.url() },
      { name: variablesKeys.NODE_ENV, value: this.validEnvironments().includes(this.NODE_ENV()) }
    ];

    mandatoryVariables.map(({ name, value }) => {
      if (!value) throw new Error(`Missing environment variable: ${name}`);
    });
  }
};
