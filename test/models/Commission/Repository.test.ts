import { commissionRepository } from "../../../src/models/Commission";
import { Commission } from "../../../src/models";
import { QueryFailedError } from "typeorm";
import { CommissionNotFoundError } from "../../../src/models/Commission/Errors";

describe("CommissionRepository", () => {
  beforeAll(async () => {
    await commissionRepository().truncate();
  });

  it("saves a commission model on the database", async () => {
    const commission = new Commission({ name: "Commission A" });
    await commissionRepository().create(commission);
    expect(await commissionRepository().findByUuid(commission.uuid)).toEqual(commission);
  });

  it("finds all commissions by a list of uuids", async () => {
    const firstCommission = new Commission({ name: "Commission A" });
    const secondCommission = new Commission({ name: "Commission B" });
    await commissionRepository().create(firstCommission);
    await commissionRepository().create(secondCommission);
    const commissions = [firstCommission, secondCommission];
    const uuids = commissions.map(({ uuid }) => uuid);
    expect(await commissionRepository().findByUuids(uuids)).toEqual(
      expect.arrayContaining(commissions)
    );
  });

  it("throws an error if the commission does not exist", async () => {
    const commission = new Commission({
      name: "Commission B"
    });
    await expect(commissionRepository().findByUuid(commission.uuid)).rejects.toThrow(
      CommissionNotFoundError
    );
  });

  it("throws an error when trying to insert a duplicated commission", async () => {
    const commission = new Commission({ name: "Commission C" });
    await commissionRepository().create(commission);
    await expect(commissionRepository().create(commission)).rejects.toThrow(QueryFailedError);
  });

  it("removes all entries from Commission table", async () => {
    const firstCommission = new Commission({ name: "Commission A" });
    const secondCommission = new Commission({ name: "Commission B" });
    await commissionRepository().create(firstCommission);
    await commissionRepository().create(secondCommission);

    expect(await commissionRepository().findAll()).toEqual(
      expect.arrayContaining([firstCommission, secondCommission])
    );

    await commissionRepository().truncate();
    expect(await commissionRepository().findAll()).toHaveLength(0);
  });
});
