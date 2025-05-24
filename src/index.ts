import { App, ExpressReceiver } from "@slack/bolt";
import dotenv from "dotenv";
dotenv.config();

//Found this online, switches to express receiver.
const installationStore = (() => {
  const store: { [teamId: string]: any } = {};

  return {
    storeInstallation: async (installation: any) => {
      if (installation.team?.id) {
        store[installation.team.id] = installation;
        console.log(`✅ Stored installation for team ${installation.team.id}`);
      } else {
        throw new Error("Missing team ID");
      }
    },
    fetchInstallation: async (query: any) => {
      if (query.teamId && store[query.teamId]) {
        console.log(`🔍 Fetched installation for team ${query.teamId}`);
        return store[query.teamId];
      }
      throw new Error("Installation not found");
    },
  };
})();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  endpoints: "/slack/commands",
});

const app = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN!,
  clientId: process.env.SLACK_CLIENT_ID!,
  clientSecret: process.env.SLACK_CLIENT_SECRET!,
  stateSecret: "some_random_secret_for_dev",
  scopes: ["commands", "chat:write"],
  installationStore,
});

app.command("/facequiz", async ({ ack, respond, command }) => {
  await ack();
  await respond(` Hello <@${command.user_id}>, face quick WORKS`);
});

receiver.app.listen(process.env.PORT || 3000, () => {
  console.log("⚡️ Slack Bolt app is running on port 3000");
});
