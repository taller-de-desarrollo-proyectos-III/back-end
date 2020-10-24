import { testClient } from "./TestClient";
import { StatusCodes } from "http-status-codes";
import * as CommissionModule from "../../src/models/Commission";
import { Commission } from "../../src/models";
import { CommissionsRoutes } from "../../src/routes/CommissionsRoutes";
import { commissionRepository } from "../../src/models/Commission";

describe("CommissionsController", () => {
  const firstCommission = new Commission({ name: "Commission A" });
  const secondCommission = new Commission({ name: "Commission B" });
  const commissions = [firstCommission, secondCommission];

  beforeAll(async () => {
    await commissionRepository().truncate();
  });

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
    jest
      .spyOn(repository, "findAll")
      .mockImplementation(() => { throw new Error(errorMessage); });
    jest
      .spyOn(CommissionModule, "commissionRepository")
      .mockImplementation(() => repository);
    const response = await testClient.get(CommissionsRoutes.path);
    expect(response.status).toEqual(StatusCodes.INTERNAL_SERVER_ERROR);
    expect(response.body).toEqual(errorMessage);
  });
});
