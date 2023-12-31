import { Configuration, OpenAIApi, CreateChatCompletionRequest } from "openai";
import { getConfig } from "./config";
import { BasicMessage } from "../types";
import { log } from "../util";

const CONFIG = getConfig();

const AS_A_REGEX = /^as a[^,]*, /i;

log(`ai config`, { ...CONFIG, apiKey: "****" });

const configuration = new Configuration({ apiKey: CONFIG.apiKey });

export const getAIResponse = async (
  msgs: BasicMessage[],
  botId: string
): Promise<string> => {
  try {
    // Only use these on the _first_ message of a chain
    if (msgs.length === 1) {
      let newText = msgs[0].text;

      if (CONFIG.prepend && !CONFIG.noPrependWords?.test(msgs[0].text)) {
        newText = CONFIG.prepend + " " + newText;
      }
      if (CONFIG.append && !CONFIG.noAppendWords?.test(msgs[0].text)) {
        newText = newText + " " + CONFIG.append;
      }
      msgs[0].text = newText;
    }

    const openai = new OpenAIApi(configuration);
    const messages = getMessageChain(msgs, botId);
    log(
      `Creating chat completion (${messages.length} total messages)`,
      messages[messages.length - 1].content
    );

    const result = await openai.createChatCompletion({
      messages,
      model: CONFIG.model,
      temperature: CONFIG.temperature,
      max_tokens: CONFIG.maxTokens,
    });

    const resultString = result.data.choices[0].message?.content || "";

    log(`Chat completion result`, resultString);

    return resultString.replace(AS_A_REGEX, "");
  } catch (e: any) {
    const result = `An error occurred: ${e.message}`;
    log(result);
    return result;
  }
};

const getMessageChain = (
  msgs: BasicMessage[],
  botId: string
): CreateChatCompletionRequest["messages"] => {
  if (
    CONFIG.conversationalDepth > 0 &&
    msgs.length > CONFIG.conversationalDepth
  ) {
    // Just use the latest X number of messages
    msgs.splice(0, msgs.length - CONFIG.conversationalDepth);
  }

  const result: CreateChatCompletionRequest["messages"] = [
    {
      role: "system",
      content: `You are ${CONFIG.behavior} assistant named ${CONFIG.name}`,
    },
  ];
  const botReg = new RegExp(`<@${botId}>`, "g");

  for (const { text, user } of msgs) {
    result.push({
      role: user === botId ? "assistant" : "user",
      content: text.replace(botReg, CONFIG.name),
    });
  }

  return result;
};
