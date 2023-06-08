import { App } from "@slack/bolt";
import { log } from "../util";

export const initAppEvents = (app: App) => {
  app.message(/.*/, async ({ message, say }) => {
    log("message found", message);
    if (message.subtype) return;

    // say() sends a message to the channel where the event was triggered
    await say({
      blocks: [
        {
          type: "section",
          text: {
            type: "mrkdwn",
            text: `Hey there <@${message.user}>!`,
          },
          accessory: {
            type: "button",
            text: {
              type: "plain_text",
              text: "Click Me",
            },
            action_id: "button_click",
          },
        },
      ],
      text: `Hey there <@${message.user}>!`,
    });
  });
};
