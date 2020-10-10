import { Environment } from "../../src/config";

describe("Environment", () => {
  it("checks for the presence of all environment variables", async () => {
    jest.spyOn(Environment, "isLocal").mockImplementationOnce(() => false);
    jest.spyOn(Environment, "NODE_ENV").mockImplementationOnce(() => Environment.TEST);
    jest.spyOn(Environment.database, "url").mockImplementationOnce(() => "someUrl");
    expect(() => Environment.validate()).not.toThrow();
  });

  it("throws an error if the database url is not defined", async () => {
    jest.spyOn(Environment, "isLocal").mockImplementationOnce(() => false);
    jest.spyOn(Environment, "NODE_ENV").mockImplementationOnce(() => Environment.TEST);
    jest.spyOn(Environment.database, "url").mockImplementationOnce(() => undefined as any);
    expect(() => Environment.validate()).toThrow("Missing environment variable: DATABASE_URL");
  });

  it("throws an error if the NODE_ENV is not defined", async () => {
    jest.spyOn(Environment, "isLocal").mockImplementationOnce(() => false);
    jest.spyOn(Environment, "NODE_ENV").mockImplementationOnce(() => undefined as any);
    jest.spyOn(Environment.database, "url").mockImplementationOnce(() => "someUrl");
    expect(() => Environment.validate()).toThrow("Missing environment variable: NODE_ENV");
  });

  it("throws an error if the NODE_ENV has an unknown value", async () => {
    jest.spyOn(Environment, "isLocal").mockImplementationOnce(() => false);
    jest.spyOn(Environment, "NODE_ENV").mockImplementationOnce(() => "unknownValue" as any);
    jest.spyOn(Environment.database, "url").mockImplementationOnce(() => "someUrl");
    expect(() => Environment.validate()).toThrow("Missing environment variable: NODE_ENV");
  });

  it("skips validation if NODE_ENV is development", async () => {
    jest.spyOn(Environment, "NODE_ENV").mockImplementationOnce(() => Environment.DEVELOPMENT);
    expect(() => Environment.validate()).not.toThrow();
  });

  it("skips validation if NODE_ENV is test", async () => {
    jest.spyOn(Environment, "NODE_ENV").mockImplementationOnce(() => Environment.TEST);
    expect(() => Environment.validate()).not.toThrow();
  });

  it("return the database url", async () => {
    jest.spyOn(Environment.database, "url").mockImplementationOnce(() => "someUrl");
    expect(Environment.database.url()).toEqual("someUrl");
  });
});
