import { testClient } from "../TestClient";
import { StatusCodes } from "http-status-codes";
import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { VolunteerCommissionRepository } from "../../../src/models/VolunteerCommission";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { VolunteersRoutes } from "../../../src/routes/VolunteersRoutes";
import { Commission, Role, Volunteer, State } from "../../../src/models";
import { UUID_REGEX } from "../../models";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";
import { VolunteerNotFoundError } from "../../../src/models/Volunteer/Errors";
import { VolunteerGenerator } from "../../Generators/Volunteer";
import { omit } from "lodash";
import { roleRepository } from "../../../src/models/Role";
import { stateRepository } from "../../../src/models/State";

describe("VolunteersController", () => {
  const firstCommission = new Commission({ name: "Commission A", description: "Commission A" });
  const secondCommission = new Commission({ name: "Commission B", description: "Commission B" });
  const commissions = [firstCommission, secondCommission];
  const commissionUuids = commissions.map(({ uuid }) => uuid);

  const firstRole = new Role({ name: "Role A", description: "Role A" });
  const secondRole = new Role({ name: "Role B", description: "Role B" });
  const roles = [firstRole, secondRole];
  const roleUuids = roles.map(({ uuid }) => uuid);

  const firstState = new State({ name: "State A" });
  const secondState = new State({ name: "State B" });

  let firstVolunteer: Volunteer;
  let secondVolunteer: Volunteer;
  let thirdVolunteer: Volunteer;

  beforeEach(async () => {
    await volunteerRepository().truncate();
    await commissionRepository().truncate();
    await roleRepository().truncate();
    await stateRepository().truncate();

    await commissionRepository().create(firstCommission);
    await commissionRepository().create(secondCommission);

    await roleRepository().insert(firstRole);
    await roleRepository().insert(secondRole);

    await stateRepository().insert(firstState);
    await stateRepository().insert(secondState);

    const volunteerGenerator = VolunteerGenerator.instance.with;
    firstVolunteer = await volunteerGenerator({ commissions, state: firstState });
    secondVolunteer = await volunteerGenerator({ roles, state: secondState });
    thirdVolunteer = await volunteerGenerator({ commissions, roles, state: secondState });
  });

  describe("GET /volunteers", () => {
    it("filters by all commissions, all roles and all states", async () => {
      const response = await testClient
        .get(VolunteersRoutes.path)
        .query({ commissionUuids: "ALL", roleUuids: "ALL", stateUuids: "ALL" });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toHaveLength(1);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            ...omit(thirdVolunteer, "stateUuid"),
            state: secondState,
            commissions: expect.arrayContaining(commissions),
            roles: expect.arrayContaining(roles)
          }
        ])
      );
    });

    it("returns volunteers with no commissions, no roles but with the given states", async () => {
      const volunteerA = await VolunteerGenerator.instance.with({ state: firstState });
      const volunteerB = await VolunteerGenerator.instance.with({ state: secondState });
      const response = await testClient.get(VolunteersRoutes.path).query({ stateUuids: "ALL" });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toHaveLength(2);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            ...omit(volunteerA, "stateUuid"),
            state: firstState,
            commissions: [],
            roles: []
          },
          {
            ...omit(volunteerB, "stateUuid"),
            state: secondState,
            commissions: [],
            roles: []
          }
        ])
      );
    });

    it("returns volunteers that belong to the given commissions and have no roles", async () => {
      const response = await testClient
        .get(VolunteersRoutes.path)
        .query({ commissionUuids, stateUuids: "ALL" });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toHaveLength(1);
      expect(response.body).toEqual(
        expect.arrayContaining([
          {
            ...omit(firstVolunteer, "stateUuid"),
            state: firstState,
            commissions: expect.arrayContaining(commissions),
            roles: []
          }
        ])
      );
    });

    it("returns volunteers that belong to the given roles and have no commissions", async () => {
      const response = await testClient
        .get(VolunteersRoutes.path)
        .query({ roleUuids, stateUuids: "ALL" });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([
        {
          ...omit(secondVolunteer, "stateUuid"),
          state: secondState,
          commissions: [],
          roles: expect.arrayContaining(roles)
        }
      ]);
    });

    it("returns volunteers that belong to the given roles and commissions", async () => {
      const response = await testClient
        .get(VolunteersRoutes.path)
        .query({ roleUuids, commissionUuids, stateUuids: "ALL" });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([
        {
          ...omit(thirdVolunteer, "stateUuid"),
          state: secondState,
          commissions: expect.arrayContaining(commissions),
          roles: expect.arrayContaining(roles)
        }
      ]);
    });

    it("returns volunteers with no roles and no commissions", async () => {
      const state = firstState;
      const volunteer = await VolunteerGenerator.instance.with({ state });
      const response = await testClient
        .get(VolunteersRoutes.path)
        .query({ commissionUuids: [], roles: [], stateUuids: "ALL" });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([
        { ...omit(volunteer, "stateUuid"), commissions: [], roles: [], state }
      ]);
    });

    it("returns no volunteers if given unknown commissionUuids", async () => {
      const response = await testClient
        .get(VolunteersRoutes.path)
        .query({ commissionUuids: [UuidGenerator.generate()] });
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual([]);
    });

    it("returns an internal server error if given array of numbers", async () => {
      const response = await testClient
        .get(VolunteersRoutes.path)
        .query({ commissionUuids: [1, 2, 3, 4] });
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual('invalid input syntax for type uuid: "1"');
    });
  });

  describe("POST /volunteers", () => {
    const expectToReturnBadRequestOnUndefinedAttribute = async ({
      attribute,
      message
    }: {
      attribute: string;
      message: string;
    }) => {
      const attributes = VolunteerGenerator.attributes({ stateUuid: firstState.uuid });
      const response = await testClient.post(VolunteersRoutes.path).send({
        ...omit(attributes, attribute),
        commissionUuids
      });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(message);
    };

    it("creates a new volunteer with no commissions and no roles", async () => {
      const attributes = VolunteerGenerator.attributes({ stateUuid: firstState.uuid });
      const response = await testClient.post(VolunteersRoutes.path).send(attributes);
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        ...attributes,
        commissions: [],
        roles: []
      });
    });

    it("creates a new volunteer with commissions", async () => {
      const attributes = VolunteerGenerator.attributes({ stateUuid: secondState.uuid });
      const response = await testClient.post(VolunteersRoutes.path).send({
        ...attributes,
        commissionUuids
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        ...attributes,
        commissions: expect.arrayContaining(commissions),
        roles: []
      });
    });

    it("creates a new volunteer with roles", async () => {
      const attributes = VolunteerGenerator.attributes({ stateUuid: firstState.uuid });
      const response = await testClient.post(VolunteersRoutes.path).send({
        ...attributes,
        roleUuids
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        ...attributes,
        commissions: [],
        roles: expect.arrayContaining(roles)
      });
    });

    it("creates a new volunteer with only obligatory attributes", async () => {
      const attributes = {
        dni: "12345678",
        name: "John",
        surname: "Doe",
        email: "johndoe@gmail.com",
        phoneNumber: "1165287676",
        stateUuid: secondState.uuid
      };
      const response = await testClient.post(VolunteersRoutes.path).send(attributes);
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        ...attributes,
        commissions: [],
        roles: []
      });
    });

    it("returns bad request if dni is not defined", async () => {
      await expectToReturnBadRequestOnUndefinedAttribute({
        attribute: "dni",
        message: AttributeNotDefinedError.buildMessage("dni")
      });
    });

    it("returns bad request if name is not defined", async () => {
      await expectToReturnBadRequestOnUndefinedAttribute({
        attribute: "name",
        message: AttributeNotDefinedError.buildMessage("name")
      });
    });

    it("returns bad request if surname is not defined", async () => {
      await expectToReturnBadRequestOnUndefinedAttribute({
        attribute: "surname",
        message: AttributeNotDefinedError.buildMessage("surname")
      });
    });

    it("returns bad request if email is not defined", async () => {
      await expectToReturnBadRequestOnUndefinedAttribute({
        attribute: "email",
        message: AttributeNotDefinedError.buildMessage("email")
      });
    });

    it("returns bad request if phoneNumber is not defined", async () => {
      await expectToReturnBadRequestOnUndefinedAttribute({
        attribute: "phoneNumber",
        message: AttributeNotDefinedError.buildMessage("phoneNumber")
      });
    });

    it("returns bad request the uuid generates an undefined value", async () => {
      jest.spyOn(UuidGenerator, "generate").mockImplementation(() => undefined as any);
      await expectToReturnBadRequestOnUndefinedAttribute({
        attribute: "uuid",
        message: AttributeNotDefinedError.buildMessage("uuid")
      });
    });

    it("returns bad request the uuid generates an invalid value", async () => {
      jest.spyOn(UuidGenerator, "generate").mockImplementation(() => "invalid");
      await expectToReturnBadRequestOnUndefinedAttribute({
        attribute: "uuid",
        message: InvalidAttributeFormatError.buildMessage("uuid")
      });
    });

    it("returns internal server error if generates two volunteers with the same uuid", async () => {
      jest
        .spyOn(UuidGenerator, "generate")
        .mockImplementation(() => "4c925fdc-8fd4-47ed-9a24-fa81ed5cc9da");

      const attributes = VolunteerGenerator.attributes({ stateUuid: firstState.uuid });
      const firstResponse = await testClient.post(VolunteersRoutes.path).send(attributes);
      expect(firstResponse.status).toEqual(StatusCodes.CREATED);

      const secondResponse = await testClient.post(VolunteersRoutes.path).send(attributes);
      expect(secondResponse.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(secondResponse.body).toContain("duplicate key value violates unique constraint");
    });
  });

  describe("GET /volunteers/:uuid", () => {
    it("returns a volunteer by uuid with commissions", async () => {
      const uuid = firstVolunteer.uuid;
      const response = await testClient.get(`${VolunteersRoutes.path}/${uuid}`);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        ...omit(firstVolunteer, "stateUuid"),
        commissions: expect.arrayContaining(commissions),
        roles: [],
        state: firstState
      });
    });

    it("returns a volunteer by uuid with roles", async () => {
      const uuid = secondVolunteer.uuid;
      const response = await testClient.get(`${VolunteersRoutes.path}/${uuid}`);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        ...omit(secondVolunteer, "stateUuid"),
        commissions: [],
        roles: expect.arrayContaining(roles),
        state: secondState
      });
    });

    it("returns a volunteer by uuid with roles and commissions", async () => {
      const uuid = thirdVolunteer.uuid;
      const response = await testClient.get(`${VolunteersRoutes.path}/${uuid}`);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual({
        ...omit(thirdVolunteer, "stateUuid"),
        commissions: expect.arrayContaining(commissions),
        roles: expect.arrayContaining(roles),
        state: secondState
      });
    });

    it("returns a bad request if the volunteer does not exist", async () => {
      const uuid = UuidGenerator.generate();
      const response = await testClient.get(`${VolunteersRoutes.path}/${uuid}`);
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(VolunteerNotFoundError.buildMessage());
    });

    it("returns an internal server error if the uuid has invalid format", async () => {
      const uuid = undefined;
      const response = await testClient.get(`${VolunteersRoutes.path}/${uuid}`);
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual('invalid input syntax for type uuid: "undefined"');
    });
  });

  describe("PUT /volunteers", () => {
    const expectAttributeNotDefinedError = async (attributeName: string) => {
      const volunteer = await VolunteerGenerator.instance.with({ commissions: [firstCommission] });
      const response = await testClient.put(VolunteersRoutes.path).send(
        omit(
          {
            ...volunteer,
            commissionUuids: [firstCommission.uuid, secondCommission.uuid]
          },
          attributeName
        )
      );
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage(attributeName));
    };

    const expectToUpdateAttribute = async (attributeName: string, value: string | number) => {
      const volunteer = await VolunteerGenerator.instance.with({ commissions: [firstCommission] });
      const response = await testClient.put(VolunteersRoutes.path).send({
        ...volunteer,
        [attributeName]: value,
        commissionUuids: [firstCommission.uuid]
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body[attributeName]).toEqual(value);
    };

    it("adds a new commission to the volunteer", async () => {
      const volunteer = await VolunteerGenerator.instance.with({ commissions: [firstCommission] });
      const response = await testClient.put(VolunteersRoutes.path).send({
        ...volunteer,
        commissionUuids: [firstCommission.uuid, secondCommission.uuid]
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body.commissions).toEqual(
        expect.arrayContaining([firstCommission, secondCommission])
      );
    });

    it("adds role to the volunteer", async () => {
      const volunteer = await VolunteerGenerator.instance.with({ roles: [firstRole] });
      const response = await testClient.put(VolunteersRoutes.path).send({
        ...volunteer,
        roleUuids: [firstRole.uuid]
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body.roles).toEqual(expect.arrayContaining([firstRole]));
    });

    it("removes all volunteers commission if no one is provided", async () => {
      const volunteer = await VolunteerGenerator.instance.with({ commissions: [firstCommission] });
      const response = await testClient.put(VolunteersRoutes.path).send({
        ...volunteer,
        commissionUuids: []
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body.commissions).toEqual([]);
    });

    it("updates volunteers' dni", async () => {
      await expectToUpdateAttribute("dni", "999999999");
    });

    it("updates volunteers' name", async () => {
      await expectToUpdateAttribute("name", "newName");
    });

    it("updates volunteers' surname", async () => {
      await expectToUpdateAttribute("surname", "newSurname");
    });

    it("updates volunteers' email", async () => {
      await expectToUpdateAttribute("email", "newMail@gmail.com");
    });

    it("updates volunteers' linkedin", async () => {
      await expectToUpdateAttribute("linkedin", "newLinkedin");
    });

    it("updates volunteers' phoneNumber", async () => {
      await expectToUpdateAttribute("phoneNumber", "9292929292");
    });

    it("updates volunteers' telegram", async () => {
      await expectToUpdateAttribute("telegram", "newTelegram");
    });

    it("updates volunteers' admissionYear", async () => {
      await expectToUpdateAttribute("admissionYear", "3000");
    });

    it("updates volunteers' graduationYear", async () => {
      await expectToUpdateAttribute("graduationYear", "5000");
    });

    it("updates volunteers' country", async () => {
      await expectToUpdateAttribute("country", "Japan");
    });

    it("updates volunteers' notes", async () => {
      await expectToUpdateAttribute("notes", "New notes");
    });

    it("updates volunteers' pronoun", async () => {
      await expectToUpdateAttribute("pronoun", "They");
    });

    it("returns an error if no name is provided", async () => {
      await expectAttributeNotDefinedError("name");
    });

    it("returns an error if no surname is provided", async () => {
      await expectAttributeNotDefinedError("surname");
    });

    it("returns an error if no dni is provided", async () => {
      await expectAttributeNotDefinedError("dni");
    });

    it("returns an error if no email is provided", async () => {
      await expectAttributeNotDefinedError("email");
    });

    it("returns an error if no phoneNumber is provided", async () => {
      await expectAttributeNotDefinedError("phoneNumber");
    });

    it("returns an error if no stateUuid is provided", async () => {
      await expectAttributeNotDefinedError("stateUuid");
    });

    it("does not update the volunteer if the commissions update fails", async () => {
      const volunteer = await VolunteerGenerator.instance.with({ commissions: [firstCommission] });
      const errorMessage = "unexpected error";
      VolunteerCommissionRepository.prototype.update = jest.fn(() => {
        throw new Error(errorMessage);
      });

      const response = await testClient.put(VolunteersRoutes.path).send({
        ...volunteer,
        name: "newName",
        commissionUuids: [firstCommission.uuid, secondCommission.uuid]
      });

      const persistedVolunteer = await volunteerRepository().findByUuid(volunteer.uuid);
      const volunteerCommissions = await commissionRepository().findByVolunteer(volunteer);
      expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(response.body).toEqual(errorMessage);
      expect(persistedVolunteer.name).toEqual(volunteer.name);
      expect(persistedVolunteer.name).not.toEqual("newName");
      expect(volunteerCommissions).toEqual([firstCommission]);
    });
  });
});
