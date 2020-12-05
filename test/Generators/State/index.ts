import { stateRepository } from "../../../src/models/State";
import { State } from "../../../src/models";

export const StateGenerator = {
  index: 0,
  getIndex: () => {
    StateGenerator.index += 1;
    return StateGenerator.index;
  },
  instance: async () => {
    const state = new State({ name: `name${StateGenerator.getIndex()}` });
    await stateRepository().insert(state);
    return state;
  }
};
