# slack-gpt

A Slack bot implementation of the Chat-GPT API.

## How to run

1. This app uses [@slack/bolt](https://www.npmjs.com/package/@slack/bolt) for running the app
1. Set up slack bot add add to workspace (see [docs](https://slack.dev/bolt-js/tutorial/getting-started) for details). You'll need to set up the "OAuth & Permissions" and get the "Bot User OAuth Token" for the `SLACK_BOT_TOKEN` environment variable. You'll also need the "Signing Secret" from the "Basic Information" tab for the `SLACK_SIGNING_SECRET` environment variable.
1. Copy `.env.template` file into `.env.local` and populate values. You'll also need to get an OpenAI API key.
1. run `yarn dev` - app should start
1. You'll need to add set up your application in slack to send events to a webhook. To do this with local development I recommend [ngrok](https://dashboard.ngrok.com/get-started/setup) to get a public url connected to your local environment. Once that is running, set the events request url to `<ngrok-generated-url>/slack/events`.

### Slack permissions

- Within "OAuth & Permissions" ensure the following scopes are granted:

```
app_mentions:read
channels:history
channels:read
chat:write
groups:history
groups:read
groups:write
im:history
im:read
im:write
links:read
metadata.message:read
mpim:read
reactions:write
```

- Within "Event Subscriptions" ensure the following bot events are subscribed:

```
app_mention
message.channels
message.groups
message.im
```
