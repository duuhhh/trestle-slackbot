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

app.command("/getVendors", async ({ ack, respond, logger }) => {
  await ack();

  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (process.env.GOTRESTLE_API_TOKEN) {
      headers.Authorization = process.env.GOTRESTLE_API_TOKEN;
    }

    const apiBase =
      process.env.GOTRESTLE_API_BASE || "https://staging.gotrestle.com/api/v1";
    const webBase =
      process.env.GOTRESTLE_WEB_BASE || "https://staging.gotrestle.com";

    // fetches
    const resp = await fetch(`${apiBase}/vendors`, { method: "GET", headers });
    if (!resp.ok)
      throw new Error(
        `GET /vendors failed: ${resp.status} ${await resp.text()}`
      );

    const json = await resp.json();
    const vendors = Array.isArray(json?.data) ? json.data : [];

    // sort
    const clean = vendors.filter((v: any) => v?.id && v?.name);
    clean.sort((a: any, b: any) =>
      String(a.name).localeCompare(String(b.name))
    );

    // limit j in case
    const MAX = 50;
    const shown = clean.slice(0, MAX);
    const more = clean.length - shown.length;

    // slack links
    const lines = shown.length
      ? shown.map((v: any) => `• <${webBase}/vendors/${v.id}|${v.name}>`)
      : ["_(No vendors found.)_"];

    if (more > 0) lines.push(`…and ${more} more`);

    await respond({ response_type: "ephemeral", text: lines.join("\n") });
  } catch (e: any) {
    logger.error(e);
    await respond({
      response_type: "ephemeral",
      text: `Could not retrieve vendors: ${e?.message ?? "unknown error"}`,
    });
  }
});

receiver.app.listen(process.env.PORT || 3000, () => {
  console.log("⚡️ Slack Bolt app is running on port 3000");
});
