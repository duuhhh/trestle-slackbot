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
exports.getFaceQuiz = void 0;
const errors_1 = require("./errors");
const utils_1 = require("./utils");
const getFaceQuiz = (_a) =>
  __awaiter(void 0, [_a], void 0, function* ({ slackUsers, exclude = [] }) {
    const users = (0, utils_1.shuffle)(slackUsers);
    const randomUser = yield (0, utils_1.findAsync)(
      users.filter((u) => !exclude.includes(u.id)),
      (u) =>
        __awaiter(void 0, void 0, void 0, function* () {
          return yield u.hasImage();
        })
    );
    if (!randomUser) {
      throw new errors_1.NoRemainingUsers(
        "There are no users left to quiz that has image :cry:"
      );
    }
    const correctAnswer = randomUser.id;
    return {
      blocks: [
        {
          type: "image",
          image_url:
            randomUser.profile.image_original || randomUser.profile.image_192,
          alt_text: "Who is this?",
        },
        {
          type: "section",
          text: {
            type: "plain_text",
            text: "Who is this?",
          },
        },
        {
          type: "actions",
          elements: [
            {
              type: "static_select",
              action_id: "guess_name_from_picture",
              placeholder: {
                type: "plain_text",
                text: "Select an item",
                emoji: true,
              },
              options: users.map((c) => ({
                text: {
                  type: "plain_text",
                  text:
                    c.real_name ||
                    c.profile.real_name ||
                    c.name ||
                    c.profile.first_name,
                  emoji: true,
                },
                value: `${correctAnswer};${c.id}`,
              })),
            },
          ],
        },
      ],
    };
  });
exports.getFaceQuiz = getFaceQuiz;
//# sourceMappingURL=quiz.js.map
