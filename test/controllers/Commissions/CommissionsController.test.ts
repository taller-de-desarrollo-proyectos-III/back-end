import { testClient } from "../TestClient";
import { StatusCodes } from "http-status-codes";
import * as CommissionModule from "../../../src/models/Commission";
import { Commission } from "../../../src/models";
import { CommissionsRoutes } from "../../../src/routes/CommissionsRoutes";
import { commissionRepository } from "../../../src/models/Commission";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";
import { UUID_REGEX } from "../../models";
import { CommissionGenerator } from "../../Generators/Commission";
import { omit } from "lodash";

describe("CommissionsController", () => {
  const firstCommission = new Commission({ name: "Commission A", description: "Commission A" });
  const secondCommission = new Commission({ name: "Commission B", description: "Commission B" });
  const commissions = [firstCommission, secondCommission];

  beforeEach(async () => commissionRepository().truncate());

  describe("GET /commissions", () => {
    it("get all existing commissions", async () => {
      await commissionRepository().create(firstCommission);
      await commissionRepository().create(secondCommission);
      const response = await testClient.get(CommissionsRoutes.path);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(expect.arrayContaining(commissions));
    });

    it("return an empty array if no commission exist", async () => {
      await commissionRepository().truncate();
      const response = await testClient.get(CommissionsRoutes.path);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([]);
    });

    it("returns an internal server error if a commissionRepository() fails", async () => {
      const repository = commissionRepository();
      const errorMessage = "Something unexpected just happened";
      jest.spyOn(repository, "findAll").mockImplementation(() => {
        throw new Error(errorMessage);
      });
      jest.spyOn(CommissionModule, "commissionRepository").mockImplementation(() => repository);
      const response = await testClient.get(CommissionsRoutes.path);
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual(errorMessage);
    });
  });

  describe("POST /commissions", () => {
    it("creates a new commission", async () => {
      const name = "newCommission";
      const response = await testClient.post(CommissionsRoutes.path).send({ name });
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
      const response = await testClient.post(CommissionsRoutes.path).send({ name });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage("name"));
    });

    it("returns bad request if the uuid generator returns undefined", async () => {
      const name = "name";
      jest.spyOn(UuidGenerator, "generate").mockImplementation(() => undefined as any);
      const response = await testClient.post(CommissionsRoutes.path).send({ name });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage("uuid"));
    });

    it("returns bad request if the generator returns an invalid format", async () => {
      const name = "name";
      jest.spyOn(UuidGenerator, "generate").mockImplementation(() => "invalidFormat");
      const response = await testClient.post(CommissionsRoutes.path).send({ name });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(InvalidAttributeFormatError.buildMessage("uuid"));
    });

    it("returns internal server error on duplicated uuids", async () => {
      jest
        .spyOn(UuidGenerator, "generate")
        .mockImplementation(() => "4c925fdc-8fd4-47ed-9a24-fa81ed5cc9da");

      const firstResponse = await testClient.post(CommissionsRoutes.path).send({
        name: "firstName"
      });
      expect(firstResponse.status).toEqual(StatusCodes.CREATED);

      const secondResponse = await testClient.post(CommissionsRoutes.path).send({
        name: "secondName"
      });
      expect(secondResponse.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(secondResponse.body).toContain("duplicate key value violates unique constraint");
    });

    it("returns internal server error on duplicated name", async () => {
      const name = "name";
      const firstResponse = await testClient.post(CommissionsRoutes.path).send({ name });
      expect(firstResponse.status).toEqual(StatusCodes.CREATED);

      const secondResponse = await testClient.post(CommissionsRoutes.path).send({ name });
      expect(secondResponse.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(secondResponse.body).toContain("duplicate key value violates unique constraint");
    });

    it("creates two commissions and expect them to be in the database", async () => {
      let response;
      response = await testClient
        .post(CommissionsRoutes.path)
        .send({ name: "commission A", description: "commission A" });
      expect(response.status).toEqual(StatusCodes.CREATED);
      const commissionA = response.body;
      response = await testClient
        .post(CommissionsRoutes.path)
        .send({ name: "commission B", description: "commission B" });
      expect(response.status).toEqual(StatusCodes.CREATED);
      const commissionB = response.body;

      const actualCommissions = [commissionA, commissionB];
      const commissionUuids = actualCommissions.map(({ uuid }) => uuid);
      const expectedCommissions = await commissionRepository().findByUuids(commissionUuids);
      expect(expectedCommissions).toEqual(expect.arrayContaining(actualCommissions));
    });
  });

  describe("PUT /commissions", () => {
    it("updates commission' name", async () => {
      const commission = await CommissionGenerator.instance();
      const value = "newName";
      const name = "name";
      const response = await testClient.put(CommissionsRoutes.path).send({
        ...commission,
        name: value
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body[name]).toEqual(value);
    });

    it("returns an error if no name is provided", async () => {
      const commission = await CommissionGenerator.instance;
      const response = await testClient.put(CommissionsRoutes.path).send(omit(commission, "name"));
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage("name"));
    });
  });
});
