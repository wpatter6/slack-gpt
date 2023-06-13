# slack-bot-basic

## How to run

- This app uses [@slack/bolt](https://www.npmjs.com/package/@slack/bolt) for running the app
- Set up slack bot add add to workspace (see [docs](https://slack.dev/bolt-js/tutorial/getting-started) for details)
- Copy `.env.template` file into `.env.local` and populate values
- run `yarn dev` - app should start
- You'll need to add set up your application in slack to send events to a webhook. To do this with local development I recommend [ngrok](https://dashboard.ngrok.com/get-started/setup) to get a public url connected to your local environment.
