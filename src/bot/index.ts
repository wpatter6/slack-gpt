import { log } from "../util";
import { initAppEvents } from "./events";
import { initApp } from "./init";

export const initialize = async () => {
  const app = initApp();

  log("app initialized");

  initAppEvents(app);

  log("app events initialized");

  await app.start();

  log("app started");

  return app;
};
