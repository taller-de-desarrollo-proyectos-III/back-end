import { testClient } from "../TestClient";
import { StatusCodes } from "http-status-codes";
import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { VolunteersRoutes } from "../../../src/routes/VolunteersRoutes";
import { Commission, Volunteer } from "../../../src/models";
import { UUID_REGEX } from "../../models";
import { AttributeNotDefinedError, InvalidAttributeFormatError } from "../../../src/models/Errors";
import { VolunteerNotFoundError } from "../../../src/models/Volunteer/Errors";
import { VolunteerGenerator } from "../../Generators/Volunteer";
import { omit } from "lodash";

describe("VolunteersController", () => {
  const firstCommission = new Commission({ name: "Commission A" });
  const secondCommission = new Commission({ name: "Commission B" });
  const commissions = [firstCommission, secondCommission];
  let firstVolunteer: Volunteer;
  let secondVolunteer: Volunteer;

  beforeEach(async () => {
    await volunteerRepository().truncate();
    await commissionRepository().truncate();

    await commissionRepository().create(firstCommission);
    await commissionRepository().create(secondCommission);
    firstVolunteer = await VolunteerGenerator.instance.withCommissions([firstCommission]);
    secondVolunteer = await VolunteerGenerator.instance.withCommissions([secondCommission]);
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
      expect(response.body).toEqual('invalid input syntax for type uuid: "1"');
    });
  });

  describe("POST /volunteers", () => {
    const commissionUuids = commissions.map(({ uuid }) => uuid);

    const expectToReturnBadRequestOnUndefinedAttribute = async ({
      attribute,
      message
    }: {
      attribute: string;
      message: string;
    }) => {
      const attributes = {
        dni: "12345678",
        name: "John",
        surname: "Doe",
        email: "johndoe@",
        linkedin: "John Doe",
        phoneNumber: "1165287676",
        telegram: "@JohnD",
        admissionYear: "2016",
        graduationYear: "2016",
        country: "Argentina"
      };
      delete attributes[attribute];
      const response = await testClient.post(VolunteersRoutes.path).send({
        ...attributes,
        commissionUuids
      });
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(message);
    };

    it("creates a new volunteer with no commissions", async () => {
      const attributes = {
        dni: "12345678",
        name: "John",
        surname: "Doe",
        email: "johndoe@gmail.com",
        linkedin: "John Doe",
        phoneNumber: "1165287676",
        telegram: "@JohnD",
        admissionYear: "2016",
        graduationYear: "2016",
        country: "Argentina"
      };
      const response = await testClient.post(VolunteersRoutes.path).send(attributes);
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        ...attributes,
        commissions: []
      });
    });

    it("creates a new volunteer with commissions", async () => {
      const attributes = {
        dni: "12345678",
        name: "John",
        surname: "Doe",
        email: "johndoe@gmail.com",
        linkedin: "John Doe",
        phoneNumber: "1165287676",
        telegram: "@JohnD",
        admissionYear: "2016",
        graduationYear: "2016",
        country: "Argentina"
      };
      const response = await testClient.post(VolunteersRoutes.path).send({
        ...attributes,
        commissionUuids
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        ...attributes,
        commissions: expect.arrayContaining(commissions)
      });
    });

    it("creates a new volunteer with only obligatory attributes", async () => {
      const attributes = {
        dni: "12345678",
        name: "John",
        surname: "Doe",
        email: "johndoe@gmail.com",
        phoneNumber: "1165287676"
      };
      const response = await testClient.post(VolunteersRoutes.path).send(attributes);
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body).toEqual({
        uuid: expect.stringMatching(UUID_REGEX),
        ...attributes,
        commissions: []
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

      const attributes = {
        dni: "12345678",
        name: "John",
        surname: "Doe",
        email: "johndoe@gmail.com",
        linkedin: "John Doe",
        phoneNumber: "1165287676",
        telegram: "@JohnD",
        admissionYear: "2016",
        graduationYear: "2016",
        country: "Argentina"
      };
      const firstResponse = await testClient.post(VolunteersRoutes.path).send(attributes);
      expect(firstResponse.status).toEqual(StatusCodes.CREATED);

      const secondResponse = await testClient.post(VolunteersRoutes.path).send(attributes);
      expect(secondResponse.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
      expect(secondResponse.body).toContain("duplicate key value violates unique constraint");
    });
  });

  describe("GET /volunteers/:uuid", () => {
    it("returns a volunteer by uuid", async () => {
      const uuid = firstVolunteer.uuid;
      const response = await testClient.get(`${VolunteersRoutes.path}/${uuid}`);
      expect(response.status).toEqual(StatusCodes.OK);
      expect(response.body).toEqual(firstVolunteer);
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
      const volunteer = await VolunteerGenerator.instance.withCommissions([firstCommission]);
      const response = await testClient.put(VolunteersRoutes.path).send(
        omit(
          {
            ...volunteer,
            commissionUuids: [...volunteer.commissions, secondCommission].map(({ uuid }) => uuid)
          },
          attributeName
        )
      );
      expect(response.status).toEqual(StatusCodes.BAD_REQUEST);
      expect(response.body).toEqual(AttributeNotDefinedError.buildMessage(attributeName));
    };

    const expectToUpdateAttribute = async (attributeName: string, value: string | number) => {
      const volunteer = await VolunteerGenerator.instance.withCommissions([firstCommission]);
      const response = await testClient.put(VolunteersRoutes.path).send({
        ...volunteer,
        [attributeName]: value,
        commissionUuids: volunteer.commissions.map(({ uuid }) => uuid)
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body[attributeName]).toEqual(value);
    };

    it("adds a new commission to the volunteer", async () => {
      const volunteer = await VolunteerGenerator.instance.withCommissions([firstCommission]);
      const response = await testClient.put(VolunteersRoutes.path).send({
        ...volunteer,
        commissionUuids: [...volunteer.commissions, secondCommission].map(({ uuid }) => uuid)
      });
      expect(response.status).toEqual(StatusCodes.CREATED);
      expect(response.body.commissions).toEqual(
        expect.arrayContaining([firstCommission, secondCommission])
      );
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
  });
});
