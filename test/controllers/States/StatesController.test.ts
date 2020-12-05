import { testClient } from "../TestClient";
import { StatusCodes } from "http-status-codes";
import * as StateModule from "../../../src/models/State";
import { State } from "../../../src/models";
import { StatesRoutes } from "../../../src/routes/StatesRoutes";
import { stateRepository } from "../../../src/models/State";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";
import { UUID_REGEX } from "../../models";
import { StateGenerator } from "../../Generators/State";

describe("StatesController", () => {
  const firstState = new State({ name: "State A" });
  const secondState = new State({ name: "State B" });
  const states = [firstState, secondState];

  beforeEach(async () => stateRepository().truncate());

  describe("GET /states", () => {
    it("gets all existing states", async () => {
      await stateRepository().insert(firstState);
      await stateRepository().insert(secondState);
      const response = await testClient.get(StatesRoutes.path);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(expect.arrayContaining(states));
    });

    it("returns an empty array if no state exist", async () => {
      const response = await testClient.get(StatesRoutes.path);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([]);
    });

    it("returns an internal server error if a stateRepository() fails", async () => {
      const repository = stateRepository();
      const errorMessage = "Something unexpected just happened";
      jest.spyOn(repository, "findAll").mockImplementation(() => {
        throw new Error(errorMessage);
      });
      jest.spyOn(StateModule, "stateRepository").mockImplementation(() => repository);
      const response = await testClient.get(StatesRoutes.path);
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual(errorMessage);
    });
  });

  describe("POST /states", () => {
    it("creates a new state", async () => {
      const name = "newState";
      const response = await testClient.post(StatesRoutes.path).send({ name });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual(
        expect.objectContaining({
          uuid: expect.stringMatching(UUID_REGEX),
          name
        })
      );
    });

    it("returns bad request if the name is not defined", async () => {
      const name = undefined;
      const response = await testClient.post(StatesRoutes.path).send({ name });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage("name"));
    });

    it("returns bad request if the uuid generator returns undefined", async () => {
      const name = "name";
      jest.spyOn(UuidGenerator, "generate").mockImplementation(() => undefined as any);
      const response = await testClient.post(StatesRoutes.path).send({ name });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage("uuid"));
    });

    it("returns bad request if the generator returns an invalid format", async () => {
      const name = "name";
      jest.spyOn(UuidGenerator, "generate").mockImplementation(() => "invalidFormat");
      const response = await testClient.post(StatesRoutes.path).send({ name });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(InvalidAttributeFormatError.buildMessage("uuid"));
    });

    it("returns internal server error on duplicated uuids", async () => {
      jest
        .spyOn(UuidGenerator, "generate")
        .mockImplementation(() => "4c925fdc-8fd4-47ed-9a24-fa81ed5cc9da");

      const firstResponse = await testClient.post(StatesRoutes.path).send({
        name: "firstName"
      });
      expect(firstResponse.status).toEqual(StatusCodes.CREATED);

      const secondResponse = await testClient.post(StatesRoutes.path).send({
        name: "secondName"
      });
      expect(secondResponse.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(secondResponse.body).toContain("duplicate key value violates unique constraint");
    });

    it("returns internal server error on duplicated name", async () => {
      const name = "name";
      const firstResponse = await testClient.post(StatesRoutes.path).send({ name });
      expect(firstResponse.status).toEqual(StatusCodes.CREATED);

      const secondResponse = await testClient.post(StatesRoutes.path).send({ name });
      expect(secondResponse.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(secondResponse.body).toContain("duplicate key value violates unique constraint");
    });

    it("creates two states and expect them to be in the database", async () => {
      let response;
      response = await testClient.post(StatesRoutes.path).send({ name: "state A" });
      expect(response.status).toEqual(StatusCodes.CREATED);
      const stateA = response.body;
      response = await testClient.post(StatesRoutes.path).send({ name: "state B" });
      expect(response.status).toEqual(StatusCodes.CREATED);
      const stateB = response.body;

      const actualStates = [stateA, stateB];
      const stateUuids = actualStates.map(({ uuid }) => uuid);
      const expectedStates = await stateRepository().findByUuids(stateUuids);
      expect(expectedStates).toEqual(expect.arrayContaining(actualStates));
    });
  });

  describe("PUT /states", () => {
    it("updates state' name", async () => {
      const state = await StateGenerator.instance();
      const value = "newName";
      const name = "name";
      const response = await testClient.put(StatesRoutes.path).send({
        ...state,
        name: value
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body[name]).toEqual(value);
    });
  });
});
