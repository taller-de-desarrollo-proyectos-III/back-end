import { Commission, Role, State } from "../../../src/models";
import { VolunteerSerializer } from "../../../src/controllers/Volunteers/Serializer";

import { volunteerRepository } from "../../../src/models/Volunteer";
import { commissionRepository } from "../../../src/models/Commission";
import { roleRepository } from "../../../src/models/Role";
import { stateRepository } from "../../../src/models/State";

import { VolunteerGenerator } from "../../Generators/Volunteer";

describe("VolunteerSerializer", () => {
  const firstCommission = new Commission({ name: "Commission A", description: "Commission A" });
  const secondCommission = new Commission({ name: "Commission B", description: "Commission B" });
  const commissions = [firstCommission, secondCommission];

  const firstRole = new Role({ name: "Role A", description: "Role A" });
  const secondRole = new Role({ name: "Role B", description: "Role B" });
  const roles = [firstRole, secondRole];

  const firstState = new State({ name: "State A" });
  const secondState = new State({ name: "State B" });

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
  });

  it("serializes a volunteer with commissions and a state", async () => {
    const volunteer = await VolunteerGenerator.instance.with({ commissions, state: firstState });
    const serializedVolunteer = await VolunteerSerializer.serialize(volunteer);
    const { stateUuid, ...attributes } = volunteer;
    expect(serializedVolunteer).toEqual({
      ...attributes,
      roles: [],
      commissions: expect.arrayContaining(commissions),
      state: firstState
    });
  });

  it("serializes a volunteer with roles and a state", async () => {
    const volunteer = await VolunteerGenerator.instance.with({ roles, state: secondState });
    const serializedVolunteer = await VolunteerSerializer.serialize(volunteer);
    const { stateUuid, ...attributes } = volunteer;
    expect(serializedVolunteer).toEqual({
      ...attributes,
      commissions: [],
      roles: expect.arrayContaining(roles),
      state: secondState
    });
  });

  it("serializes a volunteer with roles, commissions and a state", async () => {
    const generator = VolunteerGenerator.instance.with;
    const volunteer = await generator({ commissions, roles, state: secondState });
    const serializedVolunteer = await VolunteerSerializer.serialize(volunteer);
    const { stateUuid, ...attributes } = volunteer;
    expect(serializedVolunteer).toEqual({
      ...attributes,
      commissions: expect.arrayContaining(commissions),
      roles: expect.arrayContaining(roles),
      state: secondState
    });
  });
});
