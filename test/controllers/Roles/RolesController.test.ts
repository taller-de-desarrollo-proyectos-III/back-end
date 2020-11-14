import { testClient } from "../TestClient";
import { StatusCodes } from "http-status-codes";
import * as RoleModule from "../../../src/models/Role";
import { Role } from "../../../src/models";
import { RolesRoutes } from "../../../src/routes/RolesRoutes";
import { roleRepository } from "../../../src/models/Role";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";
import { UUID_REGEX } from "../../models";
import { RoleGenerator } from "../../Generators/Role";
import { omit } from "lodash";

describe("RolesController", () => {
  const firstRole = new Role({ name: "Role A" });
  const secondRole = new Role({ name: "Role B" });
  const roles = [firstRole, secondRole];

  beforeEach(async () => roleRepository().truncate());

  describe("GET /roles", () => {
    it("gets all existing roles", async () => {
      await roleRepository().insert(firstRole);
      await roleRepository().insert(secondRole);
      const response = await testClient.get(RolesRoutes.path);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(expect.arrayContaining(roles));
    });

    it("returns an empty array if no role exist", async () => {
      const response = await testClient.get(RolesRoutes.path);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([]);
    });

    it("returns an internal server error if a roleRepository() fails", async () => {
      const repository = roleRepository();
      const errorMessage = "Something unexpected just happened";
      jest.spyOn(repository, "findAll").mockImplementation(() => {
        throw new Error(errorMessage);
      });
      jest.spyOn(RoleModule, "roleRepository").mockImplementation(() => repository);
      const response = await testClient.get(RolesRoutes.path);
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual(errorMessage);
    });
  });

  describe("POST /roles", () => {
    it("creates a new role", async () => {
      const name = "newRole";
      const response = await testClient.post(RolesRoutes.path).send({ name });
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
      const response = await testClient.post(RolesRoutes.path).send({ name });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage("name"));
    });

    it("returns bad request if the uuid generator returns undefined", async () => {
      const name = "name";
      jest.spyOn(UuidGenerator, "generate").mockImplementation(() => undefined as any);
      const response = await testClient.post(RolesRoutes.path).send({ name });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage("uuid"));
    });

    it("returns bad request if the generator returns an invalid format", async () => {
      const name = "name";
      jest.spyOn(UuidGenerator, "generate").mockImplementation(() => "invalidFormat");
      const response = await testClient.post(RolesRoutes.path).send({ name });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(InvalidAttributeFormatError.buildMessage("uuid"));
    });

    it("returns internal server error on duplicated uuids", async () => {
      jest
        .spyOn(UuidGenerator, "generate")
        .mockImplementation(() => "4c925fdc-8fd4-47ed-9a24-fa81ed5cc9da");

      const firstResponse = await testClient.post(RolesRoutes.path).send({
        name: "firstName"
      });
      expect(firstResponse.status).toEqual(StatusCodes.CREATED);

      const secondResponse = await testClient.post(RolesRoutes.path).send({
        name: "secondName"
      });
      expect(secondResponse.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(secondResponse.body).toContain("duplicate key value violates unique constraint");
    });

    it("returns internal server error on duplicated name", async () => {
      const name = "name";
      const firstResponse = await testClient.post(RolesRoutes.path).send({ name });
      expect(firstResponse.status).toEqual(StatusCodes.CREATED);

      const secondResponse = await testClient.post(RolesRoutes.path).send({ name });
      expect(secondResponse.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(secondResponse.body).toContain("duplicate key value violates unique constraint");
    });

    it("creates two roles and expect them to be in the database", async () => {
      let response;
      response = await testClient.post(RolesRoutes.path).send({ name: "role A" });
      expect(response.status).toEqual(StatusCodes.CREATED);
      const roleA = response.body;
      response = await testClient.post(RolesRoutes.path).send({ name: "role B" });
      expect(response.status).toEqual(StatusCodes.CREATED);
      const roleB = response.body;

      const actualRoles = [roleA, roleB];
      const roleUuids = actualRoles.map(({ uuid }) => uuid);
      const expectedRoles = await roleRepository().findByUuids(roleUuids);
      expect(expectedRoles).toEqual(expect.arrayContaining(actualRoles));
    });
  });

  describe("PUT /roles", () => {
    it("updates role' name", async () => {
      const role = await RoleGenerator.instance();
      const value = "newName";
      const name = "name";
      const response = await testClient.put(RolesRoutes.path).send({
        ...role,
        name: value
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body[name]).toEqual(value);
    });

    it("returns an error if no name is provided", async () => {
      const role = await RoleGenerator.instance;
      const response = await testClient.put(RolesRoutes.path).send(omit(role, "name"));
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage("name"));
    });
  });
});
