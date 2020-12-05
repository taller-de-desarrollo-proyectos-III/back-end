import { stateRepository } from "../../../src/models/State";
import { State } from "../../../src/models";
import { QueryFailedError } from "typeorm";
import { StateNotFoundError } from "../../../src/models/State/Errors";

describe("StateRepository", () => {
  beforeEach(() => stateRepository().truncate());

  it("saves a state model on the database", async () => {
    const state = new State({ name: "State A" });
    await stateRepository().insert(state);
    expect(await stateRepository().findByUuid(state.uuid)).toEqual(state);
  });

  it("finds all states by a list of uuids", async () => {
    const firstStates = new State({ name: "State A" });
    const secondStates = new State({ name: "State B" });
    await stateRepository().insert(firstStates);
    await stateRepository().insert(secondStates);
    const states = [firstStates, secondStates];
    const uuids = states.map(({ uuid }) => uuid);
    expect(await stateRepository().findByUuids(uuids)).toEqual(expect.arrayContaining(states));
  });

  it("throws an error if the state does not exist", async () => {
    const state = new State({ name: "State B" });
    await expect(stateRepository().findByUuid(state.uuid)).rejects.toThrow(StateNotFoundError);
  });

  it("throws an error when trying to insert a duplicated state", async () => {
    const state = new State({ name: "State C" });
    await stateRepository().insert(state);
    await expect(stateRepository().insert(state)).rejects.toThrow(QueryFailedError);
  });

  it("throws an error when trying to insert a state with an existing name", async () => {
    const state = new State({ name: "State C" });
    const anotherState = new State({ name: "State C" });
    await stateRepository().insert(state);
    const matcher = expect(stateRepository().insert(anotherState));
    await matcher.rejects.toThrow(QueryFailedError);
    await matcher.rejects.toThrow("duplicate key value violates unique constraint");
  });

  it("removes all entries from State table", async () => {
    const firstState = new State({ name: "State A" });
    const secondState = new State({ name: "State B" });
    await stateRepository().insert(firstState);
    await stateRepository().insert(secondState);

    expect(await stateRepository().findAll()).toEqual(
      expect.arrayContaining([firstState, secondState])
    );

    await stateRepository().truncate();
    expect(await stateRepository().findAll()).toHaveLength(0);
  });

  describe("update", () => {
    it("updates state's name", async () => {
      const state = new State({ name: "Administrator" });
      const newName = "newName";
      state.name = newName;
      await stateRepository().save(state);
      const updatedState = await stateRepository().findByUuid(state.uuid);
      expect(updatedState.name).toEqual(newName);
    });
  });
});
