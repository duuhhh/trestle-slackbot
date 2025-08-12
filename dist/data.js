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
exports.fetchUsers = fetchUsers;
exports.getUser = getUser;
const node_fetch_1 = __importDefault(require("node-fetch"));
let userData = [];
function isRedirected(url) {
  return __awaiter(this, void 0, void 0, function* () {
    const data = yield (0, node_fetch_1.default)(url, { method: "HEAD" });
    return data.redirected;
  });
}
function hasImage(user) {
  return __awaiter(this, void 0, void 0, function* () {
    var _a, _b;
    if (
      (_a = user.profile) === null || _a === void 0 ? void 0 : _a.image_original
    ) {
      return true;
    }
    const gravatarUrl =
      (_b = user.profile) === null || _b === void 0 ? void 0 : _b.image_192;
    return !!gravatarUrl && !(yield isRedirected(gravatarUrl));
  });
}
const hasImageLazy = (user) => () =>
  __awaiter(void 0, void 0, void 0, function* () {
    if (user.hasImage !== undefined) {
      return user.hasImage();
    }
    const value = yield hasImage(user);
    user.hasImage = () =>
      __awaiter(void 0, void 0, void 0, function* () {
        return value;
      });
    return value;
  });
function fetchUsers(_a) {
  return __awaiter(
    this,
    arguments,
    void 0,
    function* ({ app, refresh = false }) {
      if (userData && !refresh) {
        return userData;
      }
      try {
        const result = yield app.client.users.list({
          token: process.env.SLACK_BOT_TOKEN,
        });
        if (!result.members) {
          console.error(`Unable to list users`);
          return [];
        }
        userData = result.members
          .filter((m) => !m.deleted && !m.is_bot && !!m.profile && !!m.id)
          .filter((m) => m.name !== "slackbot")
          .map((m) =>
            Object.assign(Object.assign({}, m), {
              id: m.id,
              profile: m.profile,
              hasImage: hasImageLazy(m),
            })
          );
        return userData;
      } catch (error) {
        console.error(error);
        return [];
      }
    }
  );
}
function getUser(_a) {
  return __awaiter(this, arguments, void 0, function* ({ app, id }) {
    const users = yield fetchUsers({ app });
    return users.find((u) => u.id === id);
  });
}
//# sourceMappingURL=data.js.map
