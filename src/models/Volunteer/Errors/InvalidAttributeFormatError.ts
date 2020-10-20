export class InvalidAttributeFormatError extends Error {
  public static buildMessage(attributeName: string) {
    return `Format for attribute ${attributeName} is invalid`;
  }

  constructor(attributeName: string) {
    super(InvalidAttributeFormatError.buildMessage(attributeName));
  }
}