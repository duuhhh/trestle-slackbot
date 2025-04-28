import dotenv from "dotenv";
dotenv.config();

import { App, LogLevel, Installation, InstallationQuery } from "@slack/bolt";

const app = new App({
  logLevel: LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  clientId: process.env.SLACK_CLIENT_ID!,
  clientSecret: process.env.SLACK_CLIENT_SECRET!,
  stateSecret: "random_secret_for_oauth_state",
  scopes: ["commands", "chat:write"],
  installationStore: {
    storeInstallation: async (installation: Installation) => {
      if (!installation.team?.id) {
        throw new Error("Missing team ID in installation");
      }
      console.log("Storing installation for:", installation.team.id);
      // TODO: save installation to DB or memory
    },
    fetchInstallation: async (installQuery: InstallationQuery<boolean>) => {
      if (!installQuery.teamId) {
        throw new Error("Missing team ID in installQuery");
      }
      console.log("Fetching installation for:", installQuery.teamId);
      return {
        team: { id: installQuery.teamId },
        enterprise: undefined,
        user: {
          token: process.env.SLACK_BOT_TOKEN!,
          id: "DUMMY_USER_ID", // Replace with actual user ID if available
          scopes: ["commands", "chat:write"],
        },
      };
    },
  },
});

app.command("/facequiz", async ({ ack, say, command }) => {
  console.log("Slash command received:", command);
  await ack();
  await say("Hello from /facequiz!");
});

(async () => {
  await app.start(process.env.PORT || 3000);
  console.log("⚡️ Slack Bolt app is running!");
})();
