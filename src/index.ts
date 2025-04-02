import { App, LogLevel } from "@slack/bolt";

// Initialize app with OAuth settings
const app = new App({
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "your-random-secret",
  scopes: ["commands", "chat:write", "app_mentions:read"], // adjust as needed
  installationStore: {
    storeInstallation: async (installation) => {
      // store in memory or database
    },
    fetchInstallation: async (installQuery) => {
      // retrieve from memory or database
    },
  },
  logLevel: LogLevel.DEBUG,
});
