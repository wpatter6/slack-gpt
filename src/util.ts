export const log = (msg: string, ...args: any[]) => {
  console.info(`slack-bot :: ${msg}`, ...args);
};
