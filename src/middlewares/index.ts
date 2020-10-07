import bodyParser from "body-parser";

export const middlewares = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true })
];
