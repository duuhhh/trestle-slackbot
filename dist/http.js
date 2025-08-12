"use strict";
var __importDefault =
  (this && this.__importDefault) ||
  function (mod) {
    return mod && mod.__esModule ? mod : { default: mod };
  };
Object.defineProperty(exports, "__esModule", { value: true });
exports.addHttpHandlers = exports.createHandler = void 0;
const express_1 = __importDefault(require("express"));
const bolt_1 = require("@slack/bolt");
const createHandler = (props) => new bolt_1.ExpressReceiver(props);
exports.createHandler = createHandler;
const addHttpHandlers = (args) => {
  args.receiver.router.use(express_1.default.json());
  args.receiver.router.use(express_1.default.urlencoded({ extended: true }));
  args.receiver.router.get("/secret-page", (req, res) => {
    const token = req.query.token;
    const hasAccess = token && args.allowedTokens.includes(token);
    if (!hasAccess) {
      console.log(`Attempted accessing http handler without valid token`);
      return res.send("OK");
    }
    args.app.dm({
      user: args.dmChannel,
      text: "/secret-page got a get request",
    });
    res.send(`Super`);
  });
  args.receiver.router.post("/webhook", (req, res) => {
    const token = req.query.token;
    const hasAccess = token && args.allowedTokens.includes(token);
    if (!hasAccess) {
      console.log(`Attempted accessing POST webhook without valid token`);
      return res.send("OK");
    }
    const dataLength = JSON.stringify(req.body).length;
    console.log(`POST /webhook received:`);
    console.log(JSON.stringify(req.body, undefined, 2));
    args.app.dm({
      user: args.dmChannel,
      text: `/webhook got a POST request with data of length ${dataLength}`,
    });
    res.send(`Super`);
  });
};
exports.addHttpHandlers = addHttpHandlers;
//# sourceMappingURL=http.js.map
