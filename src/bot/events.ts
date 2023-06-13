import { App } from "@slack/bolt";
import { log } from "../util";

export const initAppEvents = (app: App) => {
  app.message(/.*/, async ({ message, say }) => {
    log("message event", JSON.stringify(message, null, 2));

    // These messages didn't come from a user
    if (message.subtype) return;

    if (message.thread_ts) {
      const conversation = await app.client.conversations.history({
        channel: message.channel,
      });

      const msgs = conversation.messages?.filter(
        ({ thread_ts, ts }) =>
          message.thread_ts === thread_ts || ts == message.thread_ts
      );

      log("msgs", JSON.stringify(msgs));
      message.text
    }

    const thread_ts = message.thread_ts ?? message.ts;

    // say() sends a message to the channel where the event was triggered
    await say({
      thread_ts,
      text: `Hey there <@${message.user}>!`,
      /* blocks: [
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
              text: "🔄",
            },
            action_id: "button_click",
          },
        },
      ], */
    });
  });
};
