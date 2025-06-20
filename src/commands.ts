import { App, AckFn, RespondArguments, SayFn, SlashCommand } from "@slack/bolt";

import { RespondFn } from "@slack/bolt";
import { MessageError } from "./errors";
import { ChatBot } from "./types";
import { getFaceQuiz } from "./quiz";
import { fetchUsers } from "./data";
//import { App } from "@slack/bolt";

const getFaceQuizCommand =
  (app: ChatBot) =>
  async ({
    command,
    ack,
    respond,
  }: {
    command: SlashCommand;
    ack: AckFn<string>;
    respond: RespondFn;
  }) => {
    await ack();
    await respond("Thanks! Processing your face quiz...");

    // Do long async work after responding
    (async (cmd: SlashCommand) => {
      try {
        const slackUsers = await fetchUsers({ app });
        const quiz = await getFaceQuiz({
          exclude: [cmd.user_id],
          slackUsers,
        });

        await app.dm({
          user: cmd.user_id,
          blocks: quiz.blocks,
        });
      } catch (error) {
        if (error instanceof MessageError) {
          await app.dm({
            user: cmd.user_id,
            text: (error as MessageError).message,
          });
        } else {
          console.error("Unexpected error during /facequiz:", error);
        }
      }
    })(command);
  };

export const addSlashCommands = (app: ChatBot) => {
  app.command("/facequiz", getFaceQuizCommand(app));
};
