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
exports.addSlashCommands = void 0;
const errors_1 = require("./errors");
const quiz_1 = require("./quiz");
const data_1 = require("./data");
const getFaceQuizCommand = (app) => (_a) =>
  __awaiter(void 0, [_a], void 0, function* ({ command, ack, say }) {
    try {
      yield ack();
      const slackUsers = yield (0, data_1.fetchUsers)({ app });
      const quiz = yield (0, quiz_1.getFaceQuiz)({
        exclude: [command.user_id],
        slackUsers,
      });
      yield app.dm({ user: command.user_id, blocks: quiz.blocks });
    } catch (error) {
      if (error instanceof errors_1.MessageError) {
        yield app.dm({
          user: command.user_id,
          text: error.message,
        });
      } else {
        throw error;
      }
    }
  });
const addSlashCommands = (app) => {
  app.command("/facequiz", getFaceQuizCommand(app));
};
exports.addSlashCommands = addSlashCommands;
//# sourceMappingURL=commands.js.map
