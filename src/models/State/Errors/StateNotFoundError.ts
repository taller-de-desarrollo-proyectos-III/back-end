export class StateNotFoundError extends Error {
  public static buildMessage() {
    return "Could not find a state with the provided search criteria";
  }

  constructor() {
    super(StateNotFoundError.buildMessage());
  }
}
