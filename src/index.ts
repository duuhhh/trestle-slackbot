import { App, ExpressReceiver } from "@slack/bolt";

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  clientId: process.env.SLACK_CLIENT_ID!,
  clientSecret: process.env.SLACK_CLIENT_SECRET!,
  stateSecret: "super-secure-secret",
  scopes: ["commands", "chat:write", "app_mentions:read"],
  installerOptions: {
    redirectUriPath: "/slack/oauth_redirect",
  },
});

// Create the Bolt app with the receiver
const app = new App({ receiver });

// Optional home route
receiver.router.get("/", (_req, res) => {
  res.send("Slackbot is alive with OAuth 💪");
});

// Start the app
(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Bolt OAuth app is running!");
})();
