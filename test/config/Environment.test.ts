import { Environment } from "../../src/config";

describe("Environment", () => {
  it("returns the default port if it is not defined as environment variable", async () => {
    expect(Environment.PORT()).toEqual(5000);
  });

  it("checks for the presence of all environment variables", async () => {
    jest.spyOn(Environment, "isLocal").mockImplementation(() => false);
    jest.spyOn(Environment.database, "url").mockImplementation(() => "someUrl");
    expect(() => Environment.validate()).not.toThrow();
  });

  it("throws an error if the database url is not defined", async () => {
    jest.spyOn(Environment, "isLocal").mockImplementation(() => false);
    jest.spyOn(Environment.database, "url").mockImplementation(() => undefined as any);
    expect(() => Environment.validate()).toThrow("Missing environment variable: DATABASE_URL");
  });

  it("throws an error if the NODE_ENV is not defined", async () => {
    jest.spyOn(Environment, "isLocal").mockImplementation(() => false);
    jest.spyOn(Environment, "NODE_ENV").mockImplementation(() => undefined as any);
    jest.spyOn(Environment.database, "url").mockImplementation(() => "someUrl");
    expect(() => Environment.validate()).toThrow("Missing environment variable: NODE_ENV");
  });

  it("throws an error if the NODE_ENV has an unknown value", async () => {
    jest.spyOn(Environment, "isLocal").mockImplementation(() => false);
    jest.spyOn(Environment, "NODE_ENV").mockImplementation(() => "unknownValue" as any);
    jest.spyOn(Environment.database, "url").mockImplementation(() => "someUrl");
    expect(() => Environment.validate()).toThrow("Missing environment variable: NODE_ENV");
  });

  it("skips validation if NODE_ENV is development", async () => {
    jest.spyOn(Environment, "NODE_ENV").mockImplementation(() => Environment.DEVELOPMENT);
    expect(Environment.NODE_ENV()).toEqual(Environment.DEVELOPMENT);
    expect(() => Environment.validate()).not.toThrow();
  });

  it("skips validation if NODE_ENV is test", async () => {
    expect(() => Environment.validate()).not.toThrow();
  });

  it("returns the database url", async () => {
    jest.spyOn(Environment.database, "url").mockImplementationOnce(() => "someUrl");
    expect(Environment.database.url()).toEqual("someUrl");
  });
});
