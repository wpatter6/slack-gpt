import { App } from "@slack/bolt";
import { BasicMessage } from "../types";
import { getAIResponse } from "../ai";

const REACTION = process.env.PROCESSING_REACTION || "thinking_face";

export const initAppEvents = (app: App) => {
  app.message(/.*/, async ({ message, say, context: { botUserId } }) => {
    // These messages didn't come from a user
    if (message.subtype || !botUserId) return;

    let shouldRespond = false;
    const messages: BasicMessage[] = [];
    const botReg = new RegExp(`<@${botUserId}>`);

    if (message.thread_ts) {
      const conversation = await app.client.conversations.history({
        channel: message.channel,
        latest: message.thread_ts,
        inclusive: true,
      });

      const [topLevelMessage] =
        conversation.messages?.filter(
          ({ thread_ts, ts }) =>
            message.thread_ts === thread_ts || ts == message.thread_ts
        ) ?? [];

      if (topLevelMessage?.text) {
        const taggedBot = botReg.test(topLevelMessage.text);

        if (taggedBot || message.channel_type === "im") {
          shouldRespond = true;

          const replies = await app.client.conversations.replies({
            channel: message.channel,
            ts: message.thread_ts,
          });

          if (replies.messages?.length) {
            messages.push(
              ...replies.messages.map(({ text = "", user = "" }) => ({
                text,
                user,
              }))
            );
          }
        }
      }
    } else if (message.text) {
      const taggedBot = botReg.test(message.text);
      if (taggedBot || message.channel_type === "im") {
        shouldRespond = true;
        messages.push({
          user: message.user,
          text: message.text,
        });
      }
    }

    if (shouldRespond) {
      const thread_ts = message.thread_ts ?? message.ts;

      const reactionArg = {
        channel: message.channel,
        name: REACTION,
        timestamp: thread_ts,
      };

      try {
        await app.client.reactions.add(reactionArg);
      } catch {}

      const text = await getAIResponse(messages, botUserId);

      await say({
        thread_ts,
        text,
        ...(!!process.env.SUPPORT_PERSON_ID && {
          blocks: [
            {
              type: "section",
              text: {
                type: "mrkdwn",
                text,
              },
              accessory: {
                type: "button",
                text: {
                  type: "plain_text",
                  text: "😕",
                },
                action_id: "help_click",
                confirm: {
                  title: { type: "plain_text", text: "Get help" },
                  text: {
                    type: "plain_text",
                    text: "Would you like to speak with a person?",
                  },
                  confirm: {
                    type: "plain_text",
                    text: "Yes",
                  },
                  deny: {
                    type: "plain_text",
                    text: "No",
                  },
                },
              },
            },
          ],
        }),
      });

      try {
        await app.client.reactions.remove(reactionArg);
      } catch {}
    }
  });

  app.action("help_click", async ({ ack, say, body }) => {
    ack();
    const { message } = body as any;
    await say({
      channel: message.channel,
      thread_ts: message.thread_ts,
      link_names: true,
      // TODO: ping role?
      text: `Ok, let\'s get you some help from <@${process.env.SUPPORT_PERSON_ID}>`,
    });
  });
  app.action("button_click", async (payload) => {
    console.log("button_click", payload);

    payload.ack();
  });
};
