import { App } from "@slack/bolt";

const port = Number(process.env.PORT || 3000);

export const initApp = () => {
  const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
    port,
  });

  return app;
};
