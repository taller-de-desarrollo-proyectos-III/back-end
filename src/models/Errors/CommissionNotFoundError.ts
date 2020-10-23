export class CommissionNotFoundError extends Error {
  public static buildMessage() {
    return "Could not find a commission with the provided search criteria";
  }

  constructor() {
    super(CommissionNotFoundError.buildMessage());
  }
}
