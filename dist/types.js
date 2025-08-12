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
Object.defineProperty(exports, "__esModule", { value: true });
exports.ChatBot = void 0;
require("dotenv").config();
const bolt_1 = require("@slack/bolt");
class ChatBot extends bolt_1.App {
  dm(_a) {
    return __awaiter(
      this,
      arguments,
      void 0,
      function* ({ user, blocks, text = "" }) {
        const token = process.env.SLACK_BOT_TOKEN;
        yield this.client.chat.postMessage({
          channel: user,
          token,
          blocks,
          text,
        });
      }
    );
  }
}
exports.ChatBot = ChatBot;
//# sourceMappingURL=types.js.map
