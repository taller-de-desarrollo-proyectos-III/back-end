import { Request, ParamsDictionary } from "express-serve-static-core";

export interface IFetchRequest<T> extends Request<ParamsDictionary, {}, {}, T> {
  query: T;
}
