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
exports.addEvents = void 0;
const { MessageError } = require("./errors");
const { getUser } = require("./data");
const { getFaceQuiz } = require("./quiz");
const addNameGuessEventHandler = (app) => {
  app.action("guess_name_from_picture", (_a) =>
    __awaiter(void 0, [_a], void 0, function* ({ ack, say, action, body }) {
      yield ack();
      // @ts-ignore
      const [correctAnswer, answer] = action.selected_option.value.split(";");
      const user = yield getUser({ id: correctAnswer });
      const { real_name, name, profile } = user;
      const title = profile.title ? ` *${profile.title}*` : "";
      const text = `That was ${real_name} (<@${name}>).${title}`;
      if (correctAnswer === answer) {
        yield say === null || say === void 0
          ? void 0
          : say(`Correct! :cake: ${text}`);
      } else {
        yield say === null || say === void 0
          ? void 0
          : say(`Nope! :cry: ${text}`);
      }
      try {
        const quiz = yield getFaceQuiz({ exclude: [user.id, body.user.id] });
        yield say === null || say === void 0 ? void 0 : say(quiz);
      } catch (error) {
        if (error instanceof MessageError) {
          yield say === null || say === void 0 ? void 0 : say(error.message);
        } else {
          throw error;
        }
      }
    })
  );
};
const addEvents = (app) => {
  addNameGuessEventHandler(app);
};
exports.addEvents = addEvents;
//# sourceMappingURL=events.js.map
