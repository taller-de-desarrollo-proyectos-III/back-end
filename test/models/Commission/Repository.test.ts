import { commissionRepository } from "../../../src/models/Commission";
import { Commission } from "../../../src/models";
import { QueryFailedError } from "typeorm";
import { CommissionNotFoundError } from "../../../src/models/Commission/Errors";

describe("CommissionRepository", () => {
  beforeEach(() => commissionRepository().truncate());

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
    const commission = new Commission({ name: "Commission B" });
    await expect(commissionRepository().findByUuid(commission.uuid)).rejects.toThrow(
      CommissionNotFoundError
    );
  });

  it("throws an error when trying to insert a duplicated commission", async () => {
    const commission = new Commission({ name: "Commission C" });
    await commissionRepository().create(commission);
    await expect(commissionRepository().create(commission)).rejects.toThrow(QueryFailedError);
  });

  it("throws an error when trying to insert a commission with an existing name", async () => {
    const commission = new Commission({ name: "Commission C" });
    const anotherCommission = new Commission({ name: "Commission C" });
    await commissionRepository().create(commission);
    const matcher = expect(commissionRepository().create(anotherCommission));
    await matcher.rejects.toThrow(QueryFailedError);
    await matcher.rejects.toThrow(
      'duplicate key value violates unique constraint "CommissionsNameKey"'
    );
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
