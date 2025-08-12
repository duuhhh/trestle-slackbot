import { App, ExpressReceiver } from "@slack/bolt";
import dotenv from "dotenv";
dotenv.config();

const receiver = new ExpressReceiver({
  signingSecret: process.env.SLACK_SIGNING_SECRET!,
  endpoints: "/slack/commands",
});

const app = new App({
  receiver,
  token: process.env.SLACK_BOT_TOKEN!, // single-workspace mode
});

// /facequiz (already present)
app.command("/facequiz", async ({ ack, respond, command }) => {
  await ack();
  await respond(` Hello <@${command.user_id}>, face quick WORKS`);
});

// /getVendors
app.command("/getvendors", async ({ ack, respond, logger }) => {
  await ack();
  try {
    const headers: Record<string, string> = { Accept: "application/json" };
    if (process.env.GOTRESTLE_API_TOKEN)
      headers.Authorization = process.env.GOTRESTLE_API_TOKEN;

    const apiBase =
      process.env.GOTRESTLE_API_BASE || "https://staging.gotrestle.com/api/v1";
    const webBase =
      process.env.GOTRESTLE_WEB_BASE || "https://staging.gotrestle.com";

    const resp = await fetch(`${apiBase}/vendors`, { headers });
    if (!resp.ok)
      throw new Error(
        `GET /vendors failed: ${resp.status} ${await resp.text()}`
      );

    const json = await resp.json();
    const vendors = Array.isArray(json?.data) ? json.data : [];
    const clean = vendors
      .filter((v: any) => v?.id && v?.name)
      .sort((a: any, b: any) => String(a.name).localeCompare(String(b.name)));
    const MAX = 50;
    const shown = clean.slice(0, MAX);
    const more = clean.length - shown.length;

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
