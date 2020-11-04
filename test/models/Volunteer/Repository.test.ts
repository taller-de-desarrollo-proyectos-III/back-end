import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { Commission, Volunteer } from "../../../src/models";
import { QueryFailedError } from "typeorm";
import { VolunteerNotFoundError } from "../../../src/models/Volunteer/Errors";
import { AttributeNotDefinedError } from "../../../src/models/Errors";

describe("VolunteerRepository", () => {
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

  const commissionA = new Commission({ name: "Commission A" });
  const commissionB = new Commission({ name: "Commission B" });

  beforeAll(async () => {
    await volunteerRepository().truncate();
    await commissionRepository().truncate();
    await commissionRepository().create(commissionA);
    await commissionRepository().create(commissionB);
  });

  it("saves a volunteer model on the database", async () => {
    const volunteer = new Volunteer(attributes);
    await volunteerRepository().create(volunteer);
    expect(await volunteerRepository().findByUuid(volunteer.uuid)).toEqual(volunteer);
  });

  it("saves a volunteer with commissions", async () => {
    const volunteer = new Volunteer({ commissions: [commissionA, commissionB], ...attributes });
    await volunteerRepository().create(volunteer);
    await volunteerRepository().findByUuid(volunteer.uuid);
    const commissions = (await volunteerRepository().findByUuid(volunteer.uuid)).commissions;
    expect(commissions).toEqual(expect.arrayContaining([commissionA, commissionB]));
  });

  describe("update", () => {
    const expectToUpdateAttribute = async (attributeName: string, value: string | number) => {
      const volunteer = new Volunteer(attributes);
      await volunteerRepository().create(volunteer);
      volunteer[attributeName] = value;
      await volunteerRepository().save(volunteer);
      const updatedVolunteer = await volunteerRepository().findByUuid(volunteer.uuid);
      expect(updatedVolunteer[attributeName]).toEqual(value);
    };

    it("updates volunteer name", async () => {
      await expectToUpdateAttribute("name", "newName");
    });

    it("updates volunteer surname", async () => {
      await expectToUpdateAttribute("surname", "newSurname");
    });

    it("updates volunteer dni", async () => {
      await expectToUpdateAttribute("dni", "123456");
    });

    it("updates volunteer email", async () => {
      await expectToUpdateAttribute("email", "newEmail@gmail.com");
    });

    it("updates volunteer linkedin", async () => {
      await expectToUpdateAttribute("linkedin", "newLinkedin");
    });

    it("updates volunteer phoneNumber", async () => {
      await expectToUpdateAttribute("phoneNumber", "43000000");
    });

    it("updates volunteer telegram", async () => {
      await expectToUpdateAttribute("telegram", "newTelegram");
    });

    it("updates volunteer admissionYear", async () => {
      await expectToUpdateAttribute("admissionYear", "2050");
    });

    it("updates volunteer graduationYear", async () => {
      await expectToUpdateAttribute("graduationYear", "2001");
    });

    it("updates volunteer country", async () => {
      await expectToUpdateAttribute("country", "Croatia");
    });
  });

  describe("findByCommissions", () => {
    it("returns empty list if no commission is passed", async () => {
      const commissions = [commissionA, commissionB];
      const volunteer = new Volunteer({ commissions, ...attributes });
      await volunteerRepository().create(volunteer);
      expect(await volunteerRepository().findByCommissions([])).toHaveLength(0);
    });

    it("returns all the volunteers by commissions", async () => {
      const volunteerA = new Volunteer({ commissions: [commissionA], ...attributes });
      const volunteerB = new Volunteer({ commissions: [commissionB], ...attributes });
      await volunteerRepository().create(volunteerA);
      await volunteerRepository().create(volunteerB);
      expect(await volunteerRepository().findByCommissions([commissionA, commissionB])).toEqual(
        expect.arrayContaining([volunteerA, volunteerB])
      );
    });
  });

  it("throws an error if the volunteer does not exist", async () => {
    const volunteer = new Volunteer(attributes);
    await expect(volunteerRepository().findByUuid(volunteer.uuid)).rejects.toThrow(
      VolunteerNotFoundError
    );
  });

  it("throws an error if the uuid is undefined", async () => {
    await expect(volunteerRepository().findByUuid(undefined as any)).rejects.toThrow(
      AttributeNotDefinedError
    );
  });

  it("throws an error when trying to insert a duplicated volunteer", async () => {
    const volunteer = new Volunteer(attributes);
    await volunteerRepository().create(volunteer);
    await expect(volunteerRepository().create(volunteer)).rejects.toThrow(QueryFailedError);
  });

  it("removes all entries from Volunteers table", async () => {
    const firstVolunteer = new Volunteer(attributes);
    const secondVolunteer = new Volunteer(attributes);
    await volunteerRepository().create(firstVolunteer);
    await volunteerRepository().create(secondVolunteer);

    expect(await volunteerRepository().findAll()).toEqual(
      expect.arrayContaining([firstVolunteer, secondVolunteer])
    );

    await volunteerRepository().truncate();
    expect(await volunteerRepository().findAll()).toHaveLength(0);
  });
});
