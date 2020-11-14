export class RoleNotFoundError extends Error {
  public static buildMessage() {
    return "Could not find a role with the provided search criteria";
  }

  constructor() {
    super(RoleNotFoundError.buildMessage());
  }
}
