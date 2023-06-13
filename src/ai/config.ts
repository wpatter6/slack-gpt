export const getConfig = () => ({
  apiKey: process.env.OPENAI_API_KEY || "",
  model: process.env.OPENAI_MODEL || "gpt-3.5-turbo",
  behavior: process.env.OPENAI_BEHAVIOR || "friendly, helpful and professional",
  name: process.env.OPENAI_NAME || "Davinci",
  temperature: process.env.OPENAI_TEMPERATURE
    ? Number(process.env.OPENAI_TEMPERATURE)
    : 0.8,
  maxTokens: process.env.OPENAI_MAX_TOKENS
    ? Number(process.env.OPENAI_MAX_TOKENS)
    : 1000,
  conversationalDepth: process.env.MAX_CONVERSATIONAL_DEPTH
    ? Number(process.env.OPENAI_CONVERSATIONAL_DEPTH)
    : 0,
});
