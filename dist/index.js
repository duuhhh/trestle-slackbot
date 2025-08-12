"use strict";
var __awaiter =
  (this && this.__awaiter) ||
  function (thisArg, _arguments, P, generator) {
    function adopt(value) {
      return value instanceof P
        ? value
        : new P(function (resolve) {
            resolve(value);
          });
    }
    return new (P || (P = Promise))(function (resolve, reject) {
      function fulfilled(value) {
        try {
          step(generator.next(value));
        } catch (e) {
          reject(e);
        }
      }
      function rejected(value) {
        try {
          step(generator["throw"](value));
        } catch (e) {
          reject(e);
        }
      }
      function step(result) {
        result.done
          ? resolve(result.value)
          : adopt(result.value).then(fulfilled, rejected);
      }
      step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
  };
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const bolt_1 = require("@slack/bolt");
const app = new bolt_1.App({
  logLevel: bolt_1.LogLevel.DEBUG,
  signingSecret: process.env.SLACK_SIGNING_SECRET,
  clientId: process.env.SLACK_CLIENT_ID,
  clientSecret: process.env.SLACK_CLIENT_SECRET,
  stateSecret: "random_secret_for_oauth_state",
  scopes: ["commands", "chat:write"],
  installationStore: {
    storeInstallation: (installation) =>
      __awaiter(void 0, void 0, void 0, function* () {
        var _a;
        if (
          !((_a = installation.team) === null || _a === void 0 ? void 0 : _a.id)
        ) {
          throw new Error("Missing team ID in installation");
        }
        console.log("Storing installation for:", installation.team.id);
        // TODO: save installation to DB or memory
      }),
    fetchInstallation: (installQuery) =>
      __awaiter(void 0, void 0, void 0, function* () {
        if (!installQuery.teamId) {
          throw new Error("Missing team ID in installQuery");
        }
        console.log("Fetching installation for:", installQuery.teamId);
        return {
          team: { id: installQuery.teamId },
          enterprise: undefined,
          user: {
            token: process.env.SLACK_BOT_TOKEN,
            id: "DUMMY_USER_ID", // Replace with actual user ID if available
            scopes: ["commands", "chat:write"],
          },
        };
      }),
  },
});
app.command("/facequiz", (_a) =>
  __awaiter(void 0, [_a], void 0, function* ({ ack, say, command }) {
    console.log("Slash command received:", command);
    yield ack();
    yield say("Hello from /facequiz!");
  })
);
(() =>
  __awaiter(void 0, void 0, void 0, function* () {
    yield app.start(process.env.PORT || 3000);
    console.log("⚡️ Slack Bolt app is running!");
  }))();
//# sourceMappingURL=index.js.map
