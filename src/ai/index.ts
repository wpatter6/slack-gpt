import { Configuration, OpenAIApi, CreateChatCompletionRequest } from "openai";
import { getConfig } from "./config";
import { BasicMessage } from "../types";
import { log } from "../util";

const CONFIG = getConfig();

log(`ai config`, { ...CONFIG, apiKey: "****" });

const configuration = new Configuration({ apiKey: CONFIG.apiKey });

export const getAIResponse = async (
  msgs: BasicMessage[],
  botId: string
): Promise<string> => {
  try {
    const openai = new OpenAIApi(configuration);
    const messages = getMessageChain(msgs, botId);
    log(`Creating chat completion (${messages.length} messages)`);
    const result = await openai.createChatCompletion({
      messages,
      model: CONFIG.model,
      temperature: CONFIG.temperature,
      max_tokens: CONFIG.maxTokens,
    });

    log(`Chat completion result`, result.data);

    return result.data.choices[0].message?.content || "";
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
