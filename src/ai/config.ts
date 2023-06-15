export const getConfig = () => ({
  apiKey: process.env.OPENAI_API_KEY || "",
  model: process.env.OPENAI_MODEL || "text-davinci-003",
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
  prepend: process.env.THREAD_PREPEND,
  append: process.env.THREAD_APPEND,
  noPrependWords: !process.env.NO_PREPEND_WORDS
    ? null
    : new RegExp(
        (process.env.NO_PREPEND_WORDS || "")
          .split("")
          .filter((v) => !!v)
          .reduce((acc, curr) => {
            if (!acc) return curr;
            return `${acc}|${curr}`;
          }, ""),
        "i"
      ),
  noAppendWords: !process.env.NO_APPEND_WORDS
    ? null
    : new RegExp(
        (process.env.NO_APPEND_WORDS || "")
          .split("")
          .filter((v) => !!v)
          .reduce((acc, curr) => {
            if (!acc) return curr;
            return `${acc}|${curr}`;
          }, ""),
        "i"
      ),
});
