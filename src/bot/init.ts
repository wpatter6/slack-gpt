import { App } from "@slack/bolt";

const port = Number(process.env.PORT || 3000);

export const initApp = () => {
  const app = new App({
    signingSecret: process.env.SLACK_SIGNING_SECRET,
    token: process.env.SLACK_BOT_TOKEN,
    port,
    customRoutes: [
      {
        path: "/health",
        method: ["GET"],
        handler: (req, res) => {
          res.writeHead(200);
          res.end("Health check information displayed here!");
        },
      },
    ],
  });

  return app;
};
