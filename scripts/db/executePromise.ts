import { exit } from "shelljs";

export const executePromise = (promise: Promise<any>) => {
  promise
    .then(() => exit(0))
    .catch(error => {
      // tslint:disable-next-line:no-console
      console.log(error.message);
      exit(1);
    });
};
