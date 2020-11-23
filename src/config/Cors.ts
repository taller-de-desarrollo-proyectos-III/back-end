import { Environment } from "./Environment";

export const CorsConfig = {
  production: {
    origin: "https://nahual-portal-voluntaries.herokuapp.com",
    credentials: true,
    optionsSuccessStatus: 200
  },
  staging: {
    origin: "https://tdp3-frontend.herokuapp.com",
    credentials: true,
    optionsSuccessStatus: 200
  },
  development: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    optionsSuccessStatus: 200
  },
  test: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    optionsSuccessStatus: 200
  },
  travis: {
    origin: ["http://localhost:3000", "http://localhost:3001"],
    credentials: true,
    optionsSuccessStatus: 200
  }
}[Environment.NODE_ENV()];
