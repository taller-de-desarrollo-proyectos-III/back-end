import { Environment } from "./Environment";

export const CorsConfig = {
  production: {
    origin: "https://tdp3-frontend.herokuapp.com",
    credentials: true,
    optionsSuccessStatus: 200
  },
  development: {
    origin: "http://localhost:3001",
    credentials: true,
    optionsSuccessStatus: 200
  },
  test: {
    origin: "http://localhost:3001",
    credentials: true,
    optionsSuccessStatus: 200
  },
  travis: {
    origin: "http://localhost:3001",
    credentials: true,
    optionsSuccessStatus: 200
  }
}[Environment.NODE_ENV()];
