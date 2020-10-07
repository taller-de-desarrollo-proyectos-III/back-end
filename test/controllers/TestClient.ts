import supertest from "supertest";
import { App } from "../../src/App";

export const testClient = supertest(new App(5000).app);
