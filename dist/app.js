"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
require("dotenv").config();
const types_1 = require("./types");
const createApp = (config) =>
  new types_1.ChatBot({
    token: config.slackBotToken,
    signingSecret: config.slackSigningSecret,
    receiver: config.receiver,
  });
exports.createApp = createApp;
//# sourceMappingURL=app.js.map
