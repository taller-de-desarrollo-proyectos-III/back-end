export class VolunteerNotFoundError extends Error {
  public static buildMessage() {
    return "Could not find volunteer with provided search criteria";
  }

  constructor() {
    super(VolunteerNotFoundError.buildMessage());
  }
}
