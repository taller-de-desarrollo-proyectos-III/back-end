import { testClient } from "../TestClient";
import { StatusCodes } from "http-status-codes";
import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { UuidGenerator } from "../../../src/models/UuidGenerator";
import { VolunteersRoutes } from "../../../src/routes/VolunteersRoutes";
import { Commission, Volunteer } from "../../../src/models";

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
