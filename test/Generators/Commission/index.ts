import { commissionRepository } from "../../../src/models/Commission";
import { Commission } from "../../../src/models";

export const CommissionGenerator = {
  index: 0,
  getIndex: () => {
    CommissionGenerator.index += 1;
    return CommissionGenerator.index;
  },
  instance: async () => {
    const commission = new Commission({ name: `name${CommissionGenerator.getIndex()}` });
    await commissionRepository().create(commission);
    return commissionRepository().findByUuid(commission.uuid);
  }
};
