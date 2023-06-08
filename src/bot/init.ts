import { App } from "@slack/bolt";

export const initApp = () => {
  const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
    socketMode: true,
    appToken: process.env.SLACK_APP_TOKEN,
    port: Number(process.env.PORT || 3000)
  });

  return app;
}