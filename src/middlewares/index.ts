import bodyParser from "body-parser";
import { cors } from "./Cors";

export const middlewares = [
  bodyParser.json(),
  bodyParser.urlencoded({ extended: true }),
  cors()
];
