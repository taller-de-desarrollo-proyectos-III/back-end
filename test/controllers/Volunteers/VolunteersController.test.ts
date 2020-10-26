import { testClient } from "../TestClient";
import { StatusCodes } from "http-status-codes";
import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { VolunteersRoutes } from "../../../src/routes/VolunteersRoutes";
import { Commission, Volunteer } from "../../../src/models";
import { UUID_REGEX } from "../../models";
import { AttributeNotDefinedError } from "../../../src/models/Errors";

describe("VolunteersController", () => {
  const firstCommission = new Commission({ name: "Commission A" });
  const secondCommission = new Commission({ name: "Commission B" });
  const commissions = [firstCommission, secondCommission];
  const firstVolunteer = new Volunteer({
    dni: "12345678",
    name: "John",
    surname: "Doe",
    commissions: [firstCommission]
  });
  const secondVolunteer = new Volunteer({
    dni: "1234556",
    name: "Eric",
    surname: "Clapton",
    commissions: [secondCommission]
  });

  beforeAll(async () => {
    await volunteerRepository().truncate();
    await commissionRepository().truncate();

    await commissionRepository().create(firstCommission);
    await commissionRepository().create(secondCommission);
    await volunteerRepository().create(firstVolunteer);
    await volunteerRepository().create(secondVolunteer);
  });

  describe("GET /volunteers", () => {
    it("get all volunteers that belong to the given commissions", async () => {
      const commissionUuids = commissions.map(({ uuid }) => uuid);
      const response = await testClient.get(VolunteersRoutes.path).query({ commissionUuids });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(expect.arrayContaining([firstVolunteer, secondVolunteer]));
    });

    it("get all volunteers that belong the provided commission uuid", async () => {
      const commissionUuids = [firstCommission.uuid];
      const response = await testClient.get(VolunteersRoutes.path).query({ commissionUuids });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(expect.arrayContaining([firstVolunteer]));
    });

    it("returns no volunteers if given an empty array", async () => {
      const response = await testClient.get(VolunteersRoutes.path).query({ commissionUuids: [] });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([]);
    });

    it("returns no volunteers if given unknown commissionUuids", async () => {
      const commissionUuids = [UuidGenerator.generate()];
      const response = await testClient.get(VolunteersRoutes.path).query({ commissionUuids });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([]);
    });

    it("returns an internal server error if given array of numbers", async () => {
      const commissionUuids = [1, 2, 3, 4];
      const response = await testClient.get(VolunteersRoutes.path).query({ commissionUuids });
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual("invalid input syntax for type uuid: \"1\"");
    });
  });

  describe("POST /volunteers", () => {
    const commissionUuids = commissions.map(({ uuid }) => uuid);

    const expectToReturnBadRequestOnUndefinedAttribute = async (attribute: string) => {
      const attributes = { dni: "12345678", name: "John", surname: "Doe" };
      delete attributes[attribute];
      const response = await testClient.post(VolunteersRoutes.path).send({
        ...attributes,
        commissionUuids
      });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage(attribute));
    };

    it("creates a new volunteer with no commissions", async () => {
      const attributes = { dni: "12345678", name: "John", surname: "Doe" };
      const response = await testClient.post(VolunteersRoutes.path).send(attributes);
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        ...attributes,
        commissions: []
      });
    });

    it("creates a new volunteer with commissions", async () => {
      const attributes = { dni: "12345678", name: "John", surname: "Doe" };
      const response = await testClient.post(VolunteersRoutes.path).send({
        ...attributes,
        commissionUuids
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        ...attributes,
        commissions
      });
    });

    it("returns bad request if dni is not defined", async () => {
      await expectToReturnBadRequestOnUndefinedAttribute("dni");
    });

    it("returns bad request if name is not defined", async () => {
      await expectToReturnBadRequestOnUndefinedAttribute("name");
    });

    it("returns bad request if surname is not defined", async () => {
      await expectToReturnBadRequestOnUndefinedAttribute("surname");
    });

    it("returns bad request the uuid generates an undefined value", async () => {
      jest.spyOn(UuidGenerator, "generate").mockImplementation(() => undefined as any);
      await expectToReturnBadRequestOnUndefinedAttribute("uuid");
    });
  });
});
